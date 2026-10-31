import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-[200] flex justify-end" role="presentation">
        <div class="absolute inset-0 bg-[#0b0812]/70 backdrop-blur-sm animate-fadeIn" (click)="close()"></div>
        <aside class="relative flex h-dvh w-full max-w-lg flex-col overflow-hidden rounded-l-[2rem] border-l border-white/10 bg-[#151021] text-[#f7f6fb] shadow-[0_30px_90px_rgba(11,8,18,0.65)] ring-1 ring-[#c9b8fa]/10 sm:my-5 sm:mr-5 sm:h-[calc(100dvh-2.5rem)] sm:rounded-3xl sm:border sm:border-white/10 animate-slideInRight" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div class="flex shrink-0 items-center justify-between px-5 pb-4 pt-5 sm:px-7"><div><p class="eyebrow mb-2">MERZY pickup</p><h2 id="cart-title" class="text-2xl tracking-tight text-[#ffffff]">Your Order</h2></div><button (click)="close()" aria-label="Close cart" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#c9b8fa] transition-colors hover:border-[#c9b8fa] hover:bg-white/10"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
          <div class="mx-5 h-px shrink-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent sm:mx-7"></div>
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
            @if (items.length === 0) {
              <div class="flex min-h-full flex-col items-center justify-center gap-4 text-center"><div class="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#c9b8fa]/25 bg-white/5 text-[#c9b8fa]"><svg class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div><p class="text-sm text-white/55">Your cart is empty.<br>Add something from the MERZY menu.</p></div>
            } @else {
              <div class="space-y-3">
                @for (item of items; track item.id) {
                  <div class="rounded-3xl border border-white/10 bg-white/[0.05] p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><h3 class="truncate text-sm font-bold uppercase tracking-wider text-[#ffffff]">{{ item.name }}</h3><p class="mt-1 text-sm text-[#c9b8fa]">{{ item.price }} EGP each</p></div><button (click)="removeItem(item.id)" aria-label="Remove item" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-[#c9b8fa]"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22"/></svg></button></div><div class="mt-4 flex items-center justify-between"><span class="text-sm text-white/55">{{ item.price * item.quantity }} EGP</span><div class="flex items-center gap-2 rounded-full border border-white/15 bg-[#0b0812] px-2 py-1"><button (click)="decreaseQty(item.id)" [attr.aria-label]="'Decrease ' + item.name + ' quantity'" class="flex h-7 w-7 items-center justify-center rounded-full text-[#c9b8fa] transition-colors hover:bg-white/10 hover:text-white"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg></button><span class="w-6 text-center text-sm font-bold text-white">{{ item.quantity }}</span><button (click)="increaseQty(item.id)" [attr.aria-label]="'Increase ' + item.name + ' quantity'" class="flex h-7 w-7 items-center justify-center rounded-full text-[#c9b8fa] transition-colors hover:bg-white/10 hover:text-white"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg></button></div></div></div>
                }
              </div>
            }
          </div>
          @if (items.length > 0) {
            <div class="shrink-0 px-4 pb-4 sm:px-6 sm:pb-6"><div class="space-y-4 rounded-3xl border border-white/10 bg-[#0b0812]/60 p-5 sm:p-6">
              <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-4"><div class="flex items-center justify-between"><span class="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Pickup</span><span class="text-xs font-bold uppercase tracking-[0.18em] text-[#c9b8fa]">At MERZY</span></div><p class="mt-2 text-sm leading-relaxed text-white/60">Your order will be prepared for pickup at the Bibliotheca Alexandrina services area.</p></div>
              <fieldset class="rounded-3xl border border-white/10 bg-white/[0.04] p-4"><legend class="px-1 text-xs font-bold uppercase tracking-[0.18em] text-white/55">Payment</legend><label class="mt-2 flex items-center gap-3 text-sm text-white"><input type="radio" name="payment" checked disabled class="accent-[#8e4bf0]"> Pay in store</label><p class="mt-2 text-xs leading-relaxed text-white/45">Payment is completed at the MERZY counter. No card details are collected here.</p></fieldset>
              <div class="flex items-center justify-between"><span class="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Subtotal</span><span class="text-2xl text-[#ffffff]">{{ subtotal }} <span class="font-sans text-sm text-[#c9b8fa]">EGP</span></span></div>
              <button (click)="checkout()" class="btn-primary w-full justify-center py-3 text-sm"><span class="px-2 font-bold uppercase tracking-widest">Place Order</span><span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0812]"><svg class="h-5 w-5 text-[#c9b8fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span></button>
            </div></div>
          }
        </aside>
      </div>
    }
  `,
})
export class CartComponent implements OnInit, OnDestroy {
  isOpen = false;
  items: CartItem[] = [];
  subtotal = 0;
  private sub = new Subscription();

  constructor(private cartService: CartService, private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub.add(this.cartService.isOpen.subscribe(open => { this.isOpen = open; this.cdr.markForCheck(); }));
    this.sub.add(this.cartService.items.subscribe(items => { this.items = items; this.subtotal = this.cartService.subtotal; this.cdr.markForCheck(); }));
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  @HostListener('document:keydown.escape')
  handleEscape(): void { if (this.isOpen) this.close(); }

  close(): void { this.cartService.close(); }
  increaseQty(id: string): void { this.cartService.updateQty(id, (this.items.find(i => i.id === id)?.quantity ?? 0) + 1); }
  decreaseQty(id: string): void { this.cartService.updateQty(id, (this.items.find(i => i.id === id)?.quantity ?? 0) - 1); }
  removeItem(id: string): void { this.cartService.removeItem(id); }

  checkout(): void {
    if (this.items.length === 0) return;
    this.orderService.placeOrder(this.items, this.subtotal);
    this.cartService.clear();
    this.cartService.close();
  }
}
