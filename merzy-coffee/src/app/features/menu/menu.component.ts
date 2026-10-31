import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { MenuItem } from '../../core/models/menu.model';

interface Feature {
  title: string;
  description: string;
  image: string;
  alt: string;
  label: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="menu" class="menu-section reveal">
      <div class="section-heading mx-auto mb-12 px-4 sm:mb-16 sm:px-6"><span class="eyebrow mb-5 block">Discover MERZY</span><h2 class="section-title text-4xl sm:text-6xl">Coffee And Bakery, In Good Company.</h2><p class="text-base sm:text-lg">A thoughtful selection of specialty coffee, fresh pastries, breakfast treats, desserts, and seasonal bakes.</p></div>
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 sm:px-6">
        <article *ngFor="let feature of features" class="menu-feature group relative min-h-[26rem] overflow-hidden transition-all duration-500"><img [src]="feature.image" [alt]="feature.alt" width="900" height="720" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"><div class="menu-feature-content absolute inset-0"></div><div class="absolute inset-x-0 bottom-0 p-7 sm:p-9"><span class="eyebrow">{{ feature.label }}</span><h3 class="mt-3 mb-4 text-3xl sm:text-4xl">{{ feature.title }}</h3><p class="max-w-md">{{ feature.description }}</p><a [href]="feature.label === 'Specialty Coffee' ? '#coffee' : '#bakery'" class="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9b8fa] hover:text-white">{{ feature.label === 'Specialty Coffee' ? 'Discover The Coffee' : 'Explore The Bakery' }}<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></a></div></article>
      </div>
      <div class="seasonal-panel mx-4 mt-8 grid max-w-6xl grid-cols-1 sm:mx-auto sm:mt-12 lg:grid-cols-2"><div class="flex flex-col justify-center p-8 sm:p-12 lg:p-16"><span class="eyebrow mb-5">Something New To Discover</span><h3 class="mb-5 text-4xl sm:text-5xl">London Cake</h3><p class="max-w-md">From familiar favorites to seasonal creations, MERZY's bakery menu keeps things interesting.</p><p class="mt-7 text-sm font-bold uppercase tracking-widest text-[#c9b8fa]">A seasonal MERZY creation worth discovering.</p></div><div class="min-h-[20rem]"><img src="scraped/instagram/post-sep23-moments.jpg" alt="Seasonal bakery moment at MERZY" width="1000" height="700" loading="lazy" class="h-full w-full object-cover"></div></div>

      <div class="mx-auto mt-16 max-w-4xl px-4 sm:mt-24 sm:px-6">
        <div class="section-heading mb-8"><span class="eyebrow mb-4 block">The Menu</span><h3 class="section-title text-3xl sm:text-4xl">Order From MERZY</h3></div>
        <div class="mb-8 flex justify-start"><div class="menu-tabs"><button (click)="activeCategory = 'coffee'" [class.active]="activeCategory === 'coffee'" class="menu-tab">Coffee</button><button (click)="activeCategory = 'bakery'" [class.active]="activeCategory === 'bakery'" class="menu-tab">Bakery</button></div></div>
        @if (loading) { <p class="py-8 text-center text-sm text-white/60" role="status">Loading the MERZY menu…</p> }
        @if (loadError) { <div class="py-8 text-center" role="alert"><p class="mb-3 text-sm text-white/70">The menu could not be loaded. Check your connection and try again.</p><button class="menu-tab" (click)="retryMenu()">Retry</button></div> }
        @if (!loading && !loadError && activeItems.length === 0) { <p class="py-8 text-center text-sm text-white/60">No menu items are available in this category right now.</p> }
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2" [attr.aria-busy]="loading">
          @for (item of activeItems; track item.id) {
            <div class="menu-item group flex items-center gap-4 p-5 transition-all duration-300">
              <div class="min-w-0 flex-1"><div class="mb-1 flex items-baseline justify-between gap-3"><h4 class="truncate text-sm font-bold uppercase tracking-wider">{{ item.name }}</h4><span class="menu-price whitespace-nowrap text-sm font-bold">{{ item.price }} EGP</span></div><p class="text-xs leading-relaxed">{{ item.description }}</p></div>
              <button (click)="addToCart(item)" [attr.aria-label]="'Add ' + item.name + ' to cart'" class="add-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg></button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class MenuComponent implements OnInit, OnDestroy {
  private menuService = inject(MenuService);
  private cartService = inject(CartService);

  activeCategory: 'coffee' | 'bakery' = 'coffee';
  items: MenuItem[] = [];
  loading = true;
  loadError = false;
  private menuSubscription?: Subscription;

  ngOnInit(): void {
    this.menuSubscription = this.menuService.getItems().subscribe({
      next: items => { this.items = items; this.loading = false; this.loadError = false; },
      error: () => { this.loading = false; this.loadError = true; },
    });
  }

  ngOnDestroy(): void { this.menuSubscription?.unsubscribe(); }

  retryMenu(): void {
    this.loading = true;
    this.loadError = false;
    this.menuSubscription?.unsubscribe();
    this.menuSubscription = this.menuService.getItems().subscribe({
      next: items => { this.items = items; this.loading = false; this.loadError = false; },
      error: () => { this.loading = false; this.loadError = true; },
    });
  }

  features: Feature[] = [
    { label: 'Specialty Coffee', title: 'Coffee, Made With Care.', description: 'Carefully prepared espresso and manual brews made for people who appreciate the details.', image: 'scraped/instagram/post-jun05-morning.jpg', alt: 'Morning specialty coffee at MERZY' },
    { label: 'Fresh From The Bakery', title: 'A Good Pairing.', description: 'Fresh pastries and desserts made to pair perfectly with your coffee.', image: 'scraped/instagram/post-sep13-new.jpg', alt: 'Fresh bakery items from MERZY' },
  ];

  get activeItems(): MenuItem[] {
    return this.items.filter(item => item.category === this.activeCategory);
  }

  addToCart(item: MenuItem): void {
    this.cartService.addItem({ id: item.id, name: item.name, price: item.price, image: '' });
    this.cartService.open();
  }
}
