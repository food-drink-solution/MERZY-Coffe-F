import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private currentOrder$ = new BehaviorSubject<Order | null>(null);
  private timers: ReturnType<typeof setTimeout>[] = [];

  get currentOrder() {
    return this.currentOrder$.asObservable();
  }

  get snapshot(): Order | null {
    return this.currentOrder$.getValue();
  }

  placeOrder(items: CartItem[], total: number): Order {
    this.clearTimers();
    const order: Order = {
      id: 'MERZY-' + Date.now().toString(36).toUpperCase().slice(-6),
      items: items.map(i => ({ ...i })),
      total,
      status: 'received',
      createdAt: Date.now(),
    };
    this.currentOrder$.next(order);
    this.scheduleStatus('preparing', 5000);
    this.scheduleStatus('ready', 12000);
    return order;
  }

  clearOrder(): void {
    this.clearTimers();
    this.currentOrder$.next(null);
  }

  private scheduleStatus(status: OrderStatus, delay: number): void {
    this.timers.push(
      setTimeout(() => this.advanceStatus(status), delay),
    );
  }

  private advanceStatus(status: OrderStatus): void {
    const current = this.currentOrder$.getValue();
    if (!current) return;
    this.currentOrder$.next({ ...current, status });
  }

  private clearTimers(): void {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }
}
