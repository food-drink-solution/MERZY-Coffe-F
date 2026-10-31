import { Component } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  template: `
    <div class="site-backdrop fixed inset-0 -z-10 h-full w-full"></div>
    <div class="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_80%_20%,rgba(74,22,120,0.06),transparent_26%)]"></div>
  `,
})
export class BackgroundComponent {}
