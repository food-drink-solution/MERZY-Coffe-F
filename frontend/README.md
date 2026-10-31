# MERZY Frontend

Angular 18 marketing and e-commerce application for MERZY specialty coffee and bakery.

## Quick Start

```bash
cd frontend/MERZY-Coffe
npm install
npm start
```

Navigate to `http://localhost:4200/`

## Project Structure

```
frontend/MERZY-Coffe/
├── src/
│   ├── app/
│   │   ├── core/              # Core services & state
│   │   ├── features/          # Feature modules
│   │   ├── shared/            # Shared components & pipes
│   │   └── app.component.ts
│   ├── styles.css             # Global styles & design tokens
│   ├── main.ts
│   └── index.html
├── public/
│   ├── scraped/               # Cached images from scrapers
│   ├── favicon.ico
│   └── assets/
├── angular.json               # Angular CLI config
├── tailwind.config.js         # Tailwind CSS config
├── tsconfig.json
├── package.json
└── README.md
```

## Features

- ✅ Interactive product menu
- ✅ Shopping cart with real-time updates
- ✅ Order tracking system
- ✅ Responsive mobile design
- ✅ Real brand design system
- ✅ Instagram photo gallery
- ✅ Customer testimonials
- ✅ Delivery information

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 18 | Framework |
| TypeScript | 5 | Language |
| Tailwind CSS | 3 | Styling |
| RxJS | 7 | Reactive programming |
| PrimeNG | 18 | UI components |

## Development

### Create Components

```bash
ng generate component features/my-component
```

### Create Services

```bash
ng generate service core/services/my-service
```

### Run Dev Server

```bash
npm start
```

Watch mode enabled - auto-reload on file changes.

### Build for Production

```bash
npm run build
```

Output: `dist/merzy/`

### Run Tests

```bash
npm test
```

### Run Linter

```bash
npm run lint
```

## Design System

All styling uses centralized design tokens in `src/styles.css`:

### Colors
```css
--merzy-ink: #0B0812          /* Primary text */
--merzy-panel: #151021        /* Dark surfaces */
--merzy-accent: #5C0AB2       /* Brand violet */
--merzy-accent-bright: #8E4BF0 /* Electric violet */
--merzy-canvas: #F7F6FB       /* Light background */
```

### Typography
```css
--font-display: 'Sora'        /* Headings */
--font-body: 'Outfit'         /* Body text */
```

Use tokens instead of hardcoding colors/fonts:
```html
<!-- ✅ Good -->
<div class="text-[--merzy-ink] font-[--font-body]">Content</div>

<!-- ❌ Bad -->
<div class="text-black font-arial">Content</div>
```

## State Management

Angular services with RxJS observables:

```typescript
// core/services/menu.service.ts
@Injectable({ providedIn: 'root' })
export class MenuService {
  private menuSubject = new BehaviorSubject<MenuItem[]>([]);
  menu$ = this.menuSubject.asObservable();

  loadMenu() {
    // Load data...
    this.menuSubject.next(items);
  }
}

// Usage in component
export class MenuComponent {
  menu$ = this.menuService.menu$;
  
  constructor(private menuService: MenuService) {}
}

<!-- Template -->
<div *ngFor="let item of menu$ | async">
  {{ item.name }}
</div>
```

## Components

### Core Components
- `AppComponent` - Root component
- `HeaderComponent` - Navigation
- `CartComponent` - Shopping cart drawer
- `OrderTracker` - Order status display

### Feature Components
- `MenuComponent` - Product listing
- `ProductCard` - Individual product
- `CheckoutComponent` - Order form
- `GalleryComponent` - Instagram photos
- `TestimonialComponent` - Customer reviews

### Shared Components
- `Button` - Custom button styles
- `Modal` - Modal dialogs
- `LoadingSpinner` - Loading indicator
- `Toast` - Notifications

## Services

### Core Services
- `MenuService` - Product management
- `CartService` - Shopping cart state
- `OrderService` - Order operations
- `MenuDataService` - Menu data fetching

## Styling Guidelines

### Use Tailwind Classes
```html
<!-- Preferred -->
<div class="flex items-center justify-between gap-4 p-6">
  <span class="text-lg font-semibold">Order</span>
</div>

<!-- Custom CSS only when necessary -->
<style>
  .custom-gradient {
    background: linear-gradient(135deg, var(--merzy-accent) 0%, var(--merzy-accent-bright) 100%);
  }
</style>
```

### Responsive Design
```html
<!-- Mobile first -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Content -->
</div>
```

### Dark Mode Support (if applicable)
```html
<div class="bg-white dark:bg-[--merzy-panel]">
  <!-- Content -->
</div>
```

## Performance Optimization

### Code Splitting
```typescript
const routes = [
  { path: '', component: HomeComponent },
  {
    path: 'menu',
    loadChildren: () => import('./features/menu/menu.module')
      .then(m => m.MenuModule)
  }
];
```

### Image Optimization
- Use WebP format where possible
- Lazy load images with `loading="lazy"`
- Optimize image dimensions
- Use CDN for image delivery

### Bundle Analysis
```bash
npm run analyze
```

## API Integration

### HTTP Service
```typescript
@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>('/api/menu');
  }
}
```

### Error Handling
```typescript
this.menuService.getMenu()
  .pipe(
    catchError(error => {
      console.error('Failed to load menu:', error);
      return of([]);
    })
  )
  .subscribe(menu => this.menu = menu);
```

## Testing

### Unit Tests
```bash
npm test
```

### Run Specific Test
```bash
npm test -- --include='**/menu.component.spec.ts'
```

### Coverage Report
```bash
npm test -- --code-coverage
```

### Example Test
```typescript
describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [MenuService]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display menu items', () => {
    expect(component.menu.length).toBeGreaterThan(0);
  });
});
```

## Accessibility

### ARIA Labels
```html
<button aria-label="Add item to cart">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

### Keyboard Navigation
All interactive elements must be keyboard accessible:
```html
<button tabindex="0" (keydown.enter)="onAction()"></button>
```

### Color Contrast
- Text: minimum 4.5:1 contrast ratio
- Large text (18px+): minimum 3:1 contrast ratio

### Focus Indicators
```css
*:focus {
  outline: 2px solid var(--merzy-accent-bright);
  outline-offset: 2px;
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- Firebase Hosting
- Netlify
- AWS S3 + CloudFront
- Docker container

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ |
| Firefox | Latest | ✅ |
| Safari | Latest | ✅ |
| Edge | Latest | ✅ |
| IE 11 | - | ❌ |

## Troubleshooting

### Issue: Hot reload not working
```bash
# Clear cache and restart
rm -rf node_modules .angular
npm install
npm start
```

### Issue: CSS not applying
- Check class names match Tailwind utilities
- Verify design tokens are imported
- Clear browser cache

### Issue: Build errors
```bash
npm run build -- --verbose
```

### Issue: Port 4200 already in use
```bash
npm start -- --port 4321
```

## Useful Commands

```bash
# Development
npm start                 # Start dev server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Run linter
npm run analyze          # Analyze bundle size

# Updates
npm update               # Update dependencies
npm audit fix            # Fix vulnerabilities
npm outdated             # Check outdated packages

# Cleanup
npm prune                # Remove unused packages
npm run clean            # Delete dist and artifacts
```

## Git Workflow

1. Create feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

3. Push and create PR
   ```bash
   git push origin feature/my-feature
   ```

4. After approval, merge to main
   ```bash
   git checkout main
   git pull
   git merge feature/my-feature
   ```

## Environment Variables

Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'
};
```

Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.merzy.coffee'
};
```

## Related Documentation

- [README.md](../README.md) - Project overview
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Design tokens and components
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guidelines
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - System architecture

## Support

Questions or issues?
1. Check `docs/` folder
2. Review existing components for examples
3. Check Angular documentation
4. Open GitHub issue

---

**Last Updated**: October 31, 2026  
**Angular Version**: 18.2.21  
**Node Version**: 18+ required
