import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HeroComponent } from './features/hero/hero.component';
import { StoryComponent } from './features/story/story.component';
import { ServicesComponent } from './features/services/services.component';
import { ProcessComponent } from './features/process/process.component';
import { MenuComponent } from './features/menu/menu.component';
import { TestimonialsComponent } from './features/testimonials/testimonials.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BackgroundComponent } from './shared/background/background.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CartComponent } from './shared/cart/cart.component';
import { OrderTrackingComponent } from './features/order-tracking/order-tracking.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BackgroundComponent,
    HeroComponent,
    StoryComponent,
    ServicesComponent,
    ProcessComponent,
    MenuComponent,
    TestimonialsComponent,
    FooterComponent,
    NavbarComponent,
    CartComponent,
    OrderTrackingComponent,
  ],
  template: `
    <app-background></app-background>
    <app-navbar></app-navbar>
    <main class="site-main relative z-10 mx-auto max-w-[1440px] px-4 pb-4 pt-[6.75rem] sm:px-6 sm:pt-[7.5rem] lg:px-10 lg:pb-10 lg:pt-32">
      <app-hero></app-hero>
      <app-menu></app-menu>
      <app-story></app-story>
      <app-services></app-services>
      <app-process></app-process>
      <app-testimonials></app-testimonials>
    </main>
    <app-footer></app-footer>
    <app-cart></app-cart>
    <app-order-tracking></app-order-tracking>
  `,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private revealObserver?: IntersectionObserver;

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('MERZY | Specialty Coffee & Bakery in Alexandria');
    this.metaService.updateTag({ name: 'description', content: 'Discover MERZY, a specialty coffee and artisan bakery beside the Bibliotheca Alexandrina in Alexandria, Egypt. Enjoy specialty coffee, V60, fresh pastries and modern café experiences by the Mediterranean.' });
    this.metaService.updateTag({ name: 'keywords', content: 'MERZY Alexandria, MERZY Specialty Coffee, specialty coffee Alexandria, coffee shop Alexandria, cafés in Alexandria, coffee near Bibliotheca Alexandrina, bakery Alexandria, V60 Alexandria, specialty coffee Egypt, Alexandria coffee' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:title', content: 'MERZY | Specialty Coffee & Bakery in Alexandria' });
    this.metaService.updateTag({ property: 'og:description', content: 'Good coffee. Fresh bakes. Alexandria by the sea.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'MERZY | Specialty Coffee & Bakery in Alexandria' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Good coffee. Fresh bakes. Alexandria by the sea.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop' });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('motion-ready');
    this.revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        this.revealObserver?.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll<HTMLElement>('.reveal').forEach(element => this.revealObserver?.observe(element));
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }
}
