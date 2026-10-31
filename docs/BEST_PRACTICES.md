# MERZY - Best Practices Guide

## Angular Best Practices

### 1. Standalone Components
All components are standalone, eliminating the need for NgModules:
```typescript
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `...`
})
export class HeroComponent {}
```

**Benefits:**
- Simpler mental model
- Easier tree-shaking
- Better code splitting
- Reduced boilerplate

### 2. Reactive Programming with RxJS
Use Observables for all async operations:
```typescript
// ✅ Good
getOrigins(): Observable<CoffeeOrigin[]> {
  return this.http.get<CoffeeOrigin[]>('/api/origins');
}

// ❌ Avoid
async getOrigins(): Promise<CoffeeOrigin[]> {
  return await this.http.get<CoffeeOrigin[]>('/api/origins').toPromise();
}
```

### 3. OnPush Change Detection
Use OnPush for better performance:
```typescript
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class CardComponent {}
```

### 4. Type Safety
Always use strict TypeScript:
```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
}

// ❌ Avoid
const product: any = { id: 1, name: 'Coffee' };
```

### 5. Dependency Injection
Use constructor injection with providedIn:
```typescript
@Injectable({
  providedIn: 'root'
})
export class CoffeeService {
  constructor(private http: HttpClient) {}
}
```

## Tailwind CSS Best Practices

### 1. Use Utility Classes
```html
<!-- ✅ Good -->
<div class="flex items-center gap-4 p-6 rounded-lg bg-primary-400">
  Content
</div>

<!-- ❌ Avoid -->
<div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border-radius: 0.5rem; background-color: #d4a373;">
  Content
</div>
```

### 2. Extend Theme Configuration
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { 400: '#d4a373' }
    }
  }
}
```

### 3. Use @layer for Custom Components
```css
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-primary-400 rounded-lg hover:bg-primary-500;
  }
}
```

### 4. Responsive Design
```html
<!-- Mobile-first approach -->
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## Component Architecture

### 1. Smart vs Presentational Components
```typescript
// Smart Component (Container)
@Component({
  selector: 'app-coffee-list',
  template: `<app-coffee-card *ngFor="let coffee of coffees$ | async" [coffee]="coffee"></app-coffee-card>`
})
export class CoffeeListComponent {
  coffees$ = this.service.getCoffees();
  constructor(private service: CoffeeService) {}
}

// Presentational Component
@Component({
  selector: 'app-coffee-card',
  inputs: ['coffee'],
  template: `<div>{{ coffee.name }}</div>`
})
export class CoffeeCardComponent {
  coffee!: Coffee;
}
```

### 2. Component Composition
```typescript
// ✅ Good - Composable
@Component({
  selector: 'app-hero',
  imports: [HeroHeaderComponent, HeroImageComponent],
  template: `
    <app-hero-header></app-hero-header>
    <app-hero-image></app-hero-image>
  `
})

// ❌ Avoid - Monolithic
@Component({
  selector: 'app-hero',
  template: `
    <!-- 500+ lines of template -->
  `
})
```

## Service Architecture

### 1. Single Responsibility
```typescript
// ✅ Good - One responsibility
@Injectable({ providedIn: 'root' })
export class CoffeeService {
  getOrigins(): Observable<CoffeeOrigin[]> { }
  getRoastLevels(): Observable<RoastLevel[]> { }
}

// ❌ Avoid - Multiple responsibilities
@Injectable({ providedIn: 'root' })
export class AppService {
  getCoffee() { }
  getUsers() { }
  getOrders() { }
  sendEmail() { }
}
```

### 2. State Management
```typescript
// Use BehaviorSubject for shared state
private selectedOrigin$ = new BehaviorSubject<CoffeeOrigin | null>(null);

setSelectedOrigin(origin: CoffeeOrigin): void {
  this.selectedOrigin$.next(origin);
}

getSelectedOrigin(): Observable<CoffeeOrigin | null> {
  return this.selectedOrigin$.asObservable();
}
```

## Performance Optimization

### 1. Lazy Loading
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent)
  }
];
```

### 2. TrackBy in *ngFor
```html
<!-- ✅ Good -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

<!-- ❌ Avoid -->
<div *ngFor="let item of items">
  {{ item.name }}
</div>
```

```typescript
trackByFn(index: number, item: Coffee): string {
  return item.id;
}
```

### 3. Image Optimization
```html
<!-- Use responsive images -->
<img 
  src="image.jpg" 
  srcset="image-small.jpg 480w, image-medium.jpg 1024w, image-large.jpg 1920w"
  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Description"
>
```

## Testing Best Practices

### 1. Unit Tests
```typescript
describe('CoffeeService', () => {
  let service: CoffeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoffeeService);
  });

  it('should return origins', (done) => {
    service.getOrigins().subscribe(origins => {
      expect(origins.length).toBeGreaterThan(0);
      done();
    });
  });
});
```

### 2. Component Tests
```typescript
describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Code Organization

### 1. Folder Structure
```
src/app/
├── core/
│   ├── models/
│   ├── services/
│   └── guards/
├── features/
│   ├── hero/
│   ├── story/
│   └── process/
├── shared/
│   ├── components/
│   └── pipes/
└── app.component.ts
```

### 2. Naming Conventions
- Components: `*.component.ts`
- Services: `*.service.ts`
- Models: `*.model.ts`
- Guards: `*.guard.ts`
- Pipes: `*.pipe.ts`

## Security Best Practices

### 1. Sanitize User Input
```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

### 2. Use HttpClient Interceptors
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${this.token}` }
    });
    return next.handle(authReq);
  }
}
```

## Accessibility (a11y)

### 1. Semantic HTML
```html
<!-- ✅ Good -->
<nav>
  <a href="#main">Skip to main content</a>
</nav>
<main id="main">
  <h1>Page Title</h1>
</main>

<!-- ❌ Avoid -->
<div class="nav">
  <div class="link">Skip to main content</div>
</div>
```

### 2. ARIA Labels
```html
<button aria-label="Close menu" (click)="closeMenu()">
  ✕
</button>
```

### 3. Color Contrast
Ensure text has sufficient contrast ratio (WCAG AA: 4.5:1 for normal text)

## Documentation

### 1. Component Documentation
```typescript
/**
 * Hero component displays the landing section
 * 
 * @example
 * <app-hero></app-hero>
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  template: `...`
})
export class HeroComponent {}
```

### 2. Service Documentation
```typescript
/**
 * Service for managing coffee-related data
 */
@Injectable({ providedIn: 'root' })
export class CoffeeService {
  /**
   * Get all coffee origins
   * @returns Observable of coffee origins
   */
  getOrigins(): Observable<CoffeeOrigin[]> { }
}
```

## Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] No console errors or warnings
- [ ] All tests passing
- [ ] ESLint checks passing
- [ ] Environment variables configured
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Performance metrics checked
- [ ] Accessibility audit passed
- [ ] SEO meta tags added
