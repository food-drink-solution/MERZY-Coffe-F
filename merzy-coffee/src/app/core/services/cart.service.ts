import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);
  private isOpen$ = new BehaviorSubject<boolean>(false);

  get items() { return this.items$.asObservable(); }
  get isOpen() { return this.isOpen$.asObservable(); }
  get snapshot() { return this.items$.getValue(); }

  get totalCount(): number {
    return this.snapshot.reduce((sum, i) => sum + i.quantity, 0);
  }

  get subtotal(): number {
    return this.snapshot.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  addItem(item: Omit<CartItem, 'quantity'>): void {
    const current = this.snapshot;
    const existing = current.find(i => i.id === item.id);
    if (existing) {
      this.items$.next(current.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      this.items$.next([...current, { ...item, quantity: 1 }]);
    }
  }

  removeItem(id: string): void {
    this.items$.next(this.snapshot.filter(i => i.id !== id));
  }

  updateQty(id: string, qty: number): void {
    if (qty < 1) { this.removeItem(id); return; }
    this.items$.next(this.snapshot.map(i =>
      i.id === id ? { ...i, quantity: qty } : i
    ));
  }

  getItemQty(id: string): number {
    return this.snapshot.find(i => i.id === id)?.quantity ?? 0;
  }

  clear(): void {
    this.items$.next([]);
  }

  open(): void { this.isOpen$.next(true); }
  close(): void { this.isOpen$.next(false); }
  toggle(): void { this.isOpen$.next(!this.isOpen$.getValue()); }
}
