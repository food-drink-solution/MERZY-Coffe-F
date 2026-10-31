import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from '../models/cart.model';
import { Order, OrderStatus } from '../models/order.model';

interface ApiOrderItem {
  itemId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}
interface ApiOrder {
  id: string;
  code: string;
  status: string;
  subtotal: number;
  notes: string | null;
  createdAtUtc: string;
  items: ApiOrderItem[];
}
interface PlaceOrderRequest {
  items: Array<{ itemId: string; quantity: number }>;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly currentOrder$ = new BehaviorSubject<Order | null>(null);

  constructor(private readonly http: HttpClient) {}

  get currentOrder(): Observable<Order | null> { return this.currentOrder$.asObservable(); }
  get snapshot(): Order | null { return this.currentOrder$.getValue(); }

  placeOrder(items: CartItem[], _clientTotal: number): Observable<Order> {
    const request: PlaceOrderRequest = {
      items: items.map(item => ({ itemId: item.id, quantity: item.quantity })),
    };
    return this.http.post<ApiOrder>(`${environment.apiUrl}/orders`, request).pipe(
      map(response => this.toOrder(response)),
      tap(order => this.currentOrder$.next(order)),
    );
  }

  refreshOrder(id: string): Observable<Order> {
    return this.http.get<ApiOrder>(`${environment.apiUrl}/orders/${encodeURIComponent(id)}`).pipe(
      map(response => this.toOrder(response)),
      tap(order => this.currentOrder$.next(order)),
    );
  }

  clearOrder(): void { this.currentOrder$.next(null); }

  private toOrder(response: ApiOrder): Order {
    return {
      id: response.code || response.id,
      serverId: response.id,
      items: response.items.map(item => ({
        id: item.itemId,
        name: item.itemName,
        price: item.unitPrice,
        image: '',
        quantity: item.quantity,
      })),
      total: response.subtotal,
      status: this.toStatus(response.status),
      createdAt: new Date(response.createdAtUtc).getTime(),
    };
  }

  private toStatus(status: string): OrderStatus {
    switch (status.toLocaleLowerCase()) {
      case 'preparing': return 'preparing';
      case 'ready': return 'ready';
      default: return 'received';
    }
  }
}
