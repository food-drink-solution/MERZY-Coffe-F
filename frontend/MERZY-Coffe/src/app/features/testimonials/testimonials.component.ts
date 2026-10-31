import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialService } from '../../core/services/social.service';
import { MerzyComment, MerzySocialPost, MerzySocialProfile } from '../../core/data/merzy-social';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="location" class="mt-24 reveal sm:mt-32 lg:mt-44">
      <div class="location-panel mx-4 grid overflow-hidden sm:mx-6 lg:mx-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
          <span class="eyebrow mb-5">Alexandria</span>
          <h2 class="mb-6 text-4xl sm:text-6xl">Coffee By The Mediterranean</h2>
          <p class="location-copy mb-5 text-base sm:text-lg">MERZY sits beside one of Alexandria's most recognizable cultural landmarks — the Bibliotheca Alexandrina.</p>
          <p class="location-copy mb-8 text-base sm:text-lg">Come for the coffee. Stay for the view, the atmosphere and the rhythm of Alexandria.</p>
          <a href="#find-merzy" class="btn-primary group w-max text-sm"><span class="px-3 font-bold uppercase tracking-widest">Find MERZY</span><span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0812] group-hover:translate-x-1"><svg class="h-5 w-5 text-[#c9b8fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></span></a>
        </div>
        <div class="relative min-h-[26rem] lg:min-h-0">
          <img [src]="locationImage" alt="MERZY space in the Bibliotheca Alexandrina services area — real photo from @merzy.eg" width="1200" height="900" loading="lazy" class="absolute inset-0 h-full w-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-r from-[#151021]/45 via-transparent to-transparent"></div>
          <div class="absolute bottom-7 left-7"><div class="glass-effect rounded-xl px-4 py-3"><span class="text-xs font-bold uppercase tracking-widest text-[#4a1678]">Alexandria, Egypt</span><p class="mt-1 text-sm text-[#0b0812]">{{ profile.location }}</p></div></div>
        </div>
      </div>
      <div id="find-merzy" class="location-details mx-4 mt-5 grid max-w-[calc(100%-2rem)] items-center gap-7 p-8 sm:mx-6 sm:max-w-[calc(100%-3rem)] sm:p-10 md:grid-cols-[1fr_auto] lg:mx-10 lg:max-w-[calc(100%-5rem)]"><div><span class="eyebrow mb-4 block">Find Us In Alexandria</span><h3 class="mb-3 text-3xl sm:text-4xl">Bibliotheca Alexandrina Services Area</h3><p class="max-w-2xl leading-relaxed">On the Mediterranean, at the Bibliotheca Alexandrina services area, Alexandria, Egypt.</p></div><a href="#location" class="rounded-full border border-white/40 px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-white hover:border-white hover:bg-white/10">Get Directions</a></div>

      <div class="ig-strip mx-4 mt-16 p-8 sm:mx-6 sm:p-12 lg:mx-10 lg:p-16">
        <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="eyebrow mb-4 block">Real Photos, Real Guests</span>
            <h3 class="text-3xl sm:text-4xl">From our Instagram</h3>
            <p class="mt-3 max-w-xl text-sm leading-relaxed">Latest posts from <a [href]="linkTarget" target="_blank" rel="noopener" class="font-bold text-[#c9b8fa] underline-offset-4 hover:underline">{{ profile.handle }}</a> — {{ profile.followers }} followers, {{ profile.bio }}</p>
          </div>
          <a [href]="linkTarget" target="_blank" rel="noopener" class="rounded-full border border-white/40 px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white hover:border-white hover:bg-white/10">See all posts</a>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <ng-container *ngFor="let post of featuredPosts">
            <a [href]="post.url" target="_blank" rel="noopener" class="ig-card group overflow-hidden rounded-2xl">
              <div class="relative aspect-square">
                <img [src]="post.image" [alt]="'Instagram post from ' + post.date" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-[#0b0812]/80 via-transparent to-transparent opacity-80"></div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <span class="text-[0.6rem] font-bold uppercase tracking-widest text-[#c9b8fa]">{{ post.type }}</span>
                  <p *ngIf="post.likesText" class="mt-0.5 text-[0.7rem] text-white/90">{{ post.likesText }}</p>
                </div>
              </div>
            </a>
          </ng-container>
        </div>
        <div class="mt-10 flex flex-wrap gap-3">
          <ng-container *ngFor="let c of comments">
            <span class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/85">“<span class="font-bold text-[#c9b8fa]">{{ '@' + c.author }}</span> {{ c.text }}”</span>
          </ng-container>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsComponent {
  profile: MerzySocialProfile;
  featuredPosts: MerzySocialPost[];
  comments: MerzyComment[];
  linkTarget: string;
  locationImage = '/scraped/instagram/post-sep08-details.jpg';

  constructor(private social: SocialService) {
    this.profile = this.social.getProfile();
    this.featuredPosts = this.social.getFeaturedPosts(6);
    this.comments = this.social.getComments().slice(0, 4);
    this.linkTarget = this.social.getLinks().instagram;
  }
}
