import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private items: MenuItem[] = [
    // Coffee
    { id: 'espresso', name: 'Espresso', category: 'coffee', description: 'Rich, balanced and carefully extracted for a clean, satisfying cup.', price: 35 },
    { id: 'dirty-espresso', name: 'Dirty Espresso', category: 'coffee', description: 'Cold milk under a double shot of espresso — MERZY\'s flagship pour.', price: 60 },
    { id: 'americano', name: 'Americano', category: 'coffee', description: 'Espresso lengthened with hot water for a smooth, clean cup.', price: 40 },
    { id: 'cappuccino', name: 'Cappuccino', category: 'coffee', description: 'Espresso with steamed milk and a velvety layer of foam.', price: 50 },
    { id: 'latte', name: 'Latte', category: 'coffee', description: 'Smooth espresso with steamed milk and a delicate finish.', price: 55 },
    { id: 'flat-white', name: 'Flat White', category: 'coffee', description: 'Double ristretto with microfoam for a balanced, creamy cup.', price: 55 },
    { id: 'v60', name: 'V60', category: 'coffee', description: 'A manual brew revealing the character and aroma of specialty coffee.', price: 75 },
    { id: 'manual-brew', name: 'Manual Brew', category: 'coffee', description: 'Slow, careful brewing for a clean and expressive cup.', price: 70 },
    { id: 'signature-coffee', name: 'Signature Coffee', category: 'coffee', description: 'Hot and cold creations with seasonal flavors.', price: 65 },
    // Bakery
    { id: 'fresh-pastries', name: 'Fresh Pastries', category: 'bakery', description: 'Buttery, flaky and baked fresh throughout the day.', price: 45 },
    { id: 'croissants', name: 'Croissants', category: 'bakery', description: 'Classic, golden and freshly baked each morning.', price: 40 },
    { id: 'desserts', name: 'Desserts', category: 'bakery', description: 'Sweet treats made to pair perfectly with your coffee.', price: 65 },
    { id: 'seasonal-bakes', name: 'Seasonal Bakes', category: 'bakery', description: 'New creations appearing throughout the year.', price: 60 },
    { id: 'club-sandwich', name: 'Club Sandwich', category: 'bakery', description: 'Fresh baguette stacked with toasted bread, made for a coffee break.', price: 70 },
  ];

  getCoffeeItems(): MenuItem[] {
    return this.items.filter(i => i.category === 'coffee');
  }

  getBakeryItems(): MenuItem[] {
    return this.items.filter(i => i.category === 'bakery');
  }

  getByCategory(category: 'coffee' | 'bakery'): MenuItem[] {
    return this.items.filter(i => i.category === category);
  }
}
