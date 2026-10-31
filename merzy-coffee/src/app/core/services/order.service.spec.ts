import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(OrderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('submits item identifiers and quantities only, then exposes the server-confirmed order', () => {
    const item = { id: '11111111-1111-1111-1111-111111111111', name: 'Espresso', price: 999, image: '', quantity: 2 };
    let result: any;
    service.placeOrder([item], 1998).subscribe(order => result = order);
    const request = http.expectOne(`${environment.apiUrl}/orders`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ items: [{ itemId: item.id, quantity: 2 }] });
    request.flush({
      id: '22222222-2222-2222-2222-222222222222', code: 'MERZY-ABC123', status: 'Received',
      subtotal: 84, notes: null, createdAtUtc: '2026-10-31T12:00:00Z',
      items: [{ itemId: item.id, itemName: 'Espresso', unitPrice: 42, quantity: 2, lineTotal: 84 }],
    });
    expect(result.id).toBe('MERZY-ABC123');
    expect(result.total).toBe(84);
    expect(result.items[0].price).toBe(42);
    expect(service.snapshot).toEqual(result);
  });

  it('does not publish a fabricated order when the API rejects checkout', () => {
    let failed = false;
    service.placeOrder([{ id: 'bad', name: 'bad', price: 1, image: '', quantity: 1 }], 1)
      .subscribe({ error: () => failed = true });
    http.expectOne(`${environment.apiUrl}/orders`).flush({ error: 'invalid item' }, { status: 400, statusText: 'Bad Request' });
    expect(failed).toBeTrue();
    expect(service.snapshot).toBeNull();
  });
});
