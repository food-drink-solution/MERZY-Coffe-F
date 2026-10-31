import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order) {
      <div class="fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-5" role="presentation">
        <div class="absolute inset-0 bg-[#0b0812]/75 backdrop-blur-sm animate-fadeIn" (click)="close()"></div>
        <section class="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#151021] text-[#f7f6fb] shadow-2xl animate-scaleIn sm:max-h-[calc(100dvh-2.5rem)]" role="dialog" aria-modal="true" aria-labelledby="order-title">
          <div class="shrink-0 border-b border-white/10 px-6 pb-5 pt-7 text-center sm:px-8"><div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9b8fa]/35 bg-[#c9b8fa]/15"><svg class="h-7 w-7 text-[#c9b8fa]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><h2 id="order-title" class="text-3xl text-[#ffffff]">Order Confirmed</h2><p class="mt-2 text-sm font-bold uppercase tracking-widest text-[#c9b8fa]">{{ order.id }}</p></div>
          <div class="min-h-0 flex-1 overflow-y-auto">
            <div class="px-6 py-7 sm:px-8"><div class="relative flex items-start justify-between"><div class="absolute left-[16.666%] right-[16.666%] top-5 h-0.5 bg-white/15"></div><div class="absolute left-[16.666%] top-5 h-0.5 bg-[#c9b8fa] transition-all duration-700" [style.width.%]="progressWidth"></div>@for (step of steps; track step.status) {<div class="relative z-10 flex w-1/3 flex-col items-center gap-2 text-center"><div class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500" [ngClass]="circleClass(step.status)">@if (isStepDone(step.status)) {<svg class="h-5 w-5 text-[#0b0812]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>} @else if (isStepCurrent(step.status)) {<span class="h-2.5 w-2.5 rounded-full bg-[#c9b8fa]"></span>} @else {<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>}</div><span class="text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 sm:text-xs" [ngClass]="labelClass(step.status)">{{ step.label }}</span></div>}</div>@if (order.status === 'ready') {<div class="mt-6 rounded-2xl border border-[#c9b8fa]/25 bg-[#c9b8fa]/10 p-4 text-center"><p class="text-sm font-bold uppercase tracking-widest text-[#c9b8fa]">Your order is ready!</p><p class="mt-1 text-xs text-white/60">Please pick it up at MERZY.</p></div>}</div>
            <div class="border-t border-white/10 px-6 pb-6 pt-5 sm:px-8"><h3 class="mb-3 text-xs font-bold uppercase tracking-widest text-white/45">Order Details</h3><div class="space-y-2">@for (item of order.items; track item.id) {<div class="flex items-center justify-between gap-4 text-sm"><span class="text-white/70">{{ item.quantity }}× {{ item.name }}</span><span class="whitespace-nowrap text-white/50">{{ item.price * item.quantity }} EGP</span></div>}</div><div class="mt-4 flex items-center justify-between border-t border-white/10 pt-4"><span class="text-sm font-bold uppercase tracking-widest text-white">Total</span><span class="text-xl text-[#ffffff]">{{ order.total }} <span class="font-sans text-sm text-[#c9b8fa]">EGP</span></span></div></div>
          </div>
          <div class="shrink-0 border-t border-white/10 px-6 pb-6 pt-4 sm:px-8"><button (click)="close()" class="w-full rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-[#c9b8fa] hover:text-[#c9b8fa]">Close Tracking</button></div>
        </section>
      </div>
    }
  `,
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  steps = [{ status: 'received' as OrderStatus, label: 'Received' }, { status: 'preparing' as OrderStatus, label: 'Preparing' }, { status: 'ready' as OrderStatus, label: 'Ready' }];
  private sub = new Subscription();
  private refreshTimer?: ReturnType<typeof setInterval>;

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub.add(this.orderService.currentOrder.subscribe(order => {
      this.order = order;
      if (this.refreshTimer) clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
      if (order?.serverId) {
        this.refreshTimer = setInterval(() => {
          this.sub.add(this.orderService.refreshOrder(order.serverId!).subscribe({
            next: refreshed => { this.order = refreshed; this.cdr.markForCheck(); },
            error: () => { /* Keep the last server-confirmed state visible during transient failures. */ },
          }));
        }, 10000);
      }
      this.cdr.markForCheck();
    }));
  }
  ngOnDestroy(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.sub.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void { if (this.order) this.close(); }

  close(): void { this.orderService.clearOrder(); }
  get progressWidth(): number { if (!this.order || this.order.status === 'received') return 0; return this.order.status === 'preparing' ? 33.333 : 66.666; }
  isStepDone(status: OrderStatus): boolean { if (!this.order) return false; const orderIdx = this.steps.findIndex(s => s.status === this.order!.status); const stepIdx = this.steps.findIndex(s => s.status === status); return stepIdx < orderIdx; }
  isStepCurrent(status: OrderStatus): boolean { return this.order?.status === status; }
  circleClass(status: OrderStatus): string { if (this.isStepCurrent(status)) return 'bg-[#c9b8fa] border-[#c9b8fa]'; if (this.isStepDone(status)) return 'bg-[#c9b8fa] border-[#c9b8fa]'; return 'bg-[#0b0812] border-white/20'; }
  labelClass(status: OrderStatus): string { if (this.isStepCurrent(status)) return 'text-[#c9b8fa]'; if (this.isStepDone(status)) return 'text-white/75'; return 'text-white/40'; }
}
