import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SocialService } from '../../core/services/social.service';

@Component({
  selector: 'app-delivery-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="max-w-6xl mx-auto relative bg-dark-900 rounded-[2.5rem] border border-primary-400/10 overflow-hidden p-8 sm:p-12"><span class="text-primary-400 text-xs font-bold uppercase tracking-[0.3em]">MERZY</span><h2 class="text-3xl font-display text-cream mt-4">Coffee. Bakery. Mediterranean moments.</h2><p class="text-cream/60 mt-4 max-w-xl">Visit MERZY beside the Bibliotheca Alexandrina in Alexandria, Egypt.</p><div class="mt-7 flex flex-wrap gap-3"><a [href]="talabatUrl" target="_blank" rel="noopener" class="rounded-full bg-[#c9b8fa] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#0b0812] transition-colors hover:bg-[#d6c4fb]">Order delivery on Talabat</a><a [href]="instagramUrl" target="_blank" rel="noopener" class="rounded-full border border-cream/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-cream transition-colors hover:border-cream">{{ handle }}</a></div></section>
  `,
})
export class DeliveryBannerComponent {
  talabatUrl = this.social.getLinks().talabat;
  instagramUrl = this.social.getLinks().instagram;
  handle = this.social.getProfile().handle;

  constructor(private social: SocialService) {}
}
