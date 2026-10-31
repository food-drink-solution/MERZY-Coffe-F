import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-story',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="story" class="mx-auto mt-24 max-w-7xl reveal sm:mt-32 lg:mt-44">
      <div class="story-panel relative overflow-hidden p-7 sm:p-12 lg:p-16">
        <div class="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#c9b8fa]/25 blur-3xl"></div>
        <div class="relative z-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <span class="eyebrow mb-5 block">MERZY, Alexandria</span>
            <h2 class="section-title max-w-md text-4xl sm:text-5xl">A Different Kind of Coffee Break</h2>
            <p class="story-lead max-w-sm">At MERZY, specialty coffee meets the everyday rhythm of Alexandria.</p>
          </div>
          <div class="story-body max-w-2xl pt-1 text-base sm:text-lg">
            <p class="mb-7">Start your morning with a carefully prepared espresso, slow down with a V60, or pair your favorite coffee with something freshly baked from our bakery.</p>
            <p class="story-quote border-l-2 pl-6 italic">Just steps from the Bibliotheca Alexandrina and the Mediterranean, MERZY is made for quick coffee stops, slow mornings, afternoon treats, and everything in between.</p>
          </div>
        </div>
        <div class="relative z-10 mt-14 grid grid-cols-1 gap-4 border-t border-[#0b0812]/10 pt-8 md:grid-cols-3 md:gap-6 sm:mt-20">
          <article class="card feature-card"><div class="feature-icon mb-7 flex h-12 w-12 items-center justify-center rounded-full"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v-4m4 4v-4m-8 4v-4M5.25 8h13.5v9a3.75 3.75 0 01-3.75 3.75h-6A3.75 3.75 0 015.25 17V8zM18.75 11.25h1.125A1.875 1.875 0 0121.75 13.125v.75a1.875 1.875 0 01-1.875 1.875h-1.125V11.25z"/></svg></div><h3 class="mb-3 text-lg font-bold uppercase tracking-widest">Specialty Coffee</h3><p class="text-sm leading-relaxed">Carefully prepared coffee with attention to extraction, flavor, and quality.</p></article>
          <article class="card feature-card"><div class="feature-icon mb-7 flex h-12 w-12 items-center justify-center rounded-full"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m-7-9h14M5 7.5h14M5 16.5h14"/></svg></div><h3 class="mb-3 text-lg font-bold uppercase tracking-widest">Fresh Bakery</h3><p class="text-sm leading-relaxed">Pastries and desserts made to sit beautifully beside a good cup of coffee.</p></article>
          <article class="card feature-card"><div class="feature-icon mb-7 flex h-12 w-12 items-center justify-center rounded-full"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg></div><h3 class="mb-3 text-lg font-bold uppercase tracking-widest">Alexandria</h3><p class="text-sm leading-relaxed">A contemporary stop for the city, the library, and the Mediterranean waterfront.</p></article>
        </div>
      </div>
    </section>
  `,
})
export class StoryComponent {}
