import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(MenuService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads available menu items from the API and maps category and server price', () => {
    let result: unknown;
    service.getItems().subscribe(items => result = items);
    const request = http.expectOne(`${environment.apiUrl}/menu`);
    expect(request.request.method).toBe('GET');
    request.flush({ count: 2, items: [
      { id: 'a-guid', name: 'Espresso', description: 'Coffee', category: 'coffee', price: 42, imageUrl: null, isAvailable: true },
      { id: 'b-guid', name: 'Sold out', description: 'Bakery', category: 'bakery', price: 10, imageUrl: null, isAvailable: false },
    ] });
    expect(result).toEqual([{ id: 'a-guid', name: 'Espresso', category: 'coffee', description: 'Coffee', price: 42 }]);
  });

  it('surfaces API failures to subscribers', () => {
    let failed = false;
    service.getItems().subscribe({ error: () => failed = true });
    http.expectOne(`${environment.apiUrl}/menu`).flush('unavailable', { status: 503, statusText: 'Service Unavailable' });
    expect(failed).toBeTrue();
  });
});
