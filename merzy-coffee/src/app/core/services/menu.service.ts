import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuItem } from '../models/menu.model';

interface ApiMenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}
interface ApiMenuResponse { count: number; items: ApiMenuItem[]; }

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly menu$: Observable<MenuItem[]>;

  constructor(private readonly http: HttpClient) {
    this.menu$ = this.http.get<ApiMenuResponse>(`${environment.apiUrl}/menu`).pipe(
    map(response => response.items
      .filter(item => item.isAvailable)
      .map(item => ({
        id: item.id,
        name: item.name,
        category: this.toCategory(item.category),
        description: item.description,
        price: item.price,
      }))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  }

  getItems(): Observable<MenuItem[]> { return this.menu$; }

  getByCategory(category: 'coffee' | 'bakery'): Observable<MenuItem[]> {
    return this.menu$.pipe(map(items => items.filter(item => item.category === category)));
  }

  private toCategory(category: string): 'coffee' | 'bakery' {
    return category.toLocaleLowerCase() === 'bakery' ? 'bakery' : 'coffee';
  }
}
