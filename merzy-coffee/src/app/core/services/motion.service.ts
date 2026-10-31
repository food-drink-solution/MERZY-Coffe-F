import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Centralizes reduced-motion detection and reduced-motion-aware scrolling
 * so that programmatic navigation respects the user's motion preference
 * (CSS `scroll-behavior` alone is not reliable for JS-initiated scrolls).
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly isBrowser: boolean;
  private reducedMotion = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = mq.matches;
      mq.addEventListener('change', (e: MediaQueryListEvent) => (this.reducedMotion = e.matches));
    }
  }

  get prefersReducedMotion(): boolean {
    return this.reducedMotion;
  }

  /** Scrolls to the element with the given id, respecting reduced-motion. Returns true if the element exists. */
  scrollToId(id: string): boolean {
    if (!this.isBrowser) return false;
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: this.reducedMotion ? 'auto' : 'smooth', block: 'start' });
    return true;
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: this.reducedMotion ? 'auto' : 'smooth' });
  }
}
