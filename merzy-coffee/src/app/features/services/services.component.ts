import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="coffee" class="services-section reveal">
      <div class="section-heading mx-auto mb-12 px-4 sm:mb-16 sm:px-6 lg:mb-20"><span class="eyebrow mb-5 block">Specialty Coffee</span><h2 class="section-title text-4xl sm:text-6xl">Coffee, Made With Intention.</h2><p class="text-base sm:text-lg">From classic espresso drinks to carefully prepared manual brews, MERZY focuses on the details that make a great cup of coffee.</p></div>
      <div class="coffee-grid mx-auto grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:gap-5 sm:px-6">
        <article class="card coffee-card"><div class="feature-icon mb-8 flex h-14 w-14 items-center justify-center rounded-full"><svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v-4m4 4v-4m-8 4v-4M5.25 8h13.5v9a3.75 3.75 0 01-3.75 3.75h-6A3.75 3.75 0 015.25 17V8zM18.75 11.25h1.125A1.875 1.875 0 0121.75 13.125v.75a1.875 1.875 0 01-1.875 1.875h-1.125V11.25z"/></svg></div><h3 class="mb-4 text-2xl">Espresso</h3><p class="text-sm">Rich, balanced and carefully extracted for a clean, satisfying cup.</p></article>
        <article class="card coffee-card"><div class="feature-icon mb-8 flex h-14 w-14 items-center justify-center rounded-full"><svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 3v18M18 3v18M3 8h18M3 16h18"/></svg></div><h3 class="mb-4 text-2xl">V60</h3><p class="text-sm">A manual brew designed to reveal the character, aroma and delicate flavors of specialty coffee.</p></article>
        <article class="card coffee-card"><div class="feature-icon mb-8 flex h-14 w-14 items-center justify-center rounded-full"><svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m-6-9h12"/></svg></div><h3 class="mb-4 text-2xl">Signature Drinks</h3><p class="text-sm">Hot and cold creations for modern coffee lovers, with seasonal flavors and new favorites appearing throughout the year.</p></article>
      </div>
      <div id="bakery" class="bakery-panel relative mx-4 mt-16 sm:mx-6 sm:mt-24 lg:mx-10"><img src="scraped/instagram/post-sep13-new.jpg" alt="Fresh pastries and bakery details at MERZY" width="1400" height="700" loading="lazy" class="absolute inset-0 h-full w-full object-cover animate-imageSlowZoom"><div class="absolute inset-0 bg-gradient-to-r from-[#151021] via-[#151021]/85 to-[#151021]/20"></div><div class="bakery-copy relative flex h-full max-w-2xl flex-col justify-center p-8 sm:p-14 lg:p-20"><span class="eyebrow mb-5">The Bakery</span><h2 class="mb-6 text-4xl sm:text-6xl">Baked Fresh. Made To Go With Coffee.</h2><p class="mb-8">Coffee deserves something good beside it. Our bakery brings freshly prepared pastries and desserts to the MERZY experience, made for slow mornings, afternoon breaks and everything in between.</p><ul class="bakery-list grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-[0.16em]"><li>Fresh pastries</li><li>Artisan bakery items</li><li>Breakfast treats</li><li>Desserts</li><li>Seasonal creations</li><li>Coffee pairings</li></ul></div></div>
    </section>
  `,
})
export class ServicesComponent {}
