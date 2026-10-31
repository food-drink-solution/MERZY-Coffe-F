# MERZY - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

Open your browser to `http://localhost:4200`

### 3. Start Coding!
Edit files in `src/app/` and see changes instantly.

## 📁 Project Structure at a Glance

```
merzy/
├── src/
│   ├── app/
│   │   ├── core/              # Services & models
│   │   ├── features/          # Page components
│   │   ├── shared/            # Reusable components
│   │   └── app.component.ts   # Root component
│   ├── styles.css             # Global styles
│   └── index.html             # Entry point
├── tailwind.config.js         # Tailwind config
├── angular.json               # Angular config
└── package.json               # Dependencies
```

## 🎨 Key Technologies

- **Angular 18**: Latest framework
- **Tailwind CSS**: Utility-first styling
- **PrimeNG**: Enterprise UI components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming

## 📝 Common Commands

```bash
# Development
npm start                 # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint

# Testing (when configured)
npm test                 # Run unit tests
npm run e2e              # Run e2e tests

# Utilities
npm run analyze          # Analyze bundle size
npm run format           # Format code
```

## 🎯 Creating New Components

### Generate a new component
```bash
ng generate component features/my-feature
```

### Component template
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 rounded-lg bg-primary-400">
      <h1 class="text-2xl font-bold">My Feature</h1>
    </div>
  `
})
export class MyFeatureComponent {}
```

## 🔧 Creating New Services

### Generate a new service
```bash
ng generate service core/services/my-service
```

### Service template
```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor() {}

  getData(): Observable<any> {
    // Implementation
  }
}
```

## 🎨 Styling with Tailwind

### Using utility classes
```html
<div class="flex items-center gap-4 p-6 rounded-lg bg-primary-400 text-dark-900">
  <span class="text-lg font-bold">Hello</span>
</div>
```

### Custom colors (from config)
- `bg-primary-400` - Primary color
- `text-cream` - Cream text
- `bg-dark-900` - Dark background

### Responsive classes
```html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## 🔄 Working with Services

### Inject a service
```typescript
import { CoffeeService } from '../core/services/coffee.service';

export class MyComponent {
  constructor(private coffeeService: CoffeeService) {}

  ngOnInit() {
    this.coffeeService.getOrigins().subscribe(origins => {
      console.log(origins);
    });
  }
}
```

## 📦 Building for Production

```bash
npm run build
```

Output will be in `dist/merzy/`

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🐛 Debugging

### Enable source maps
```bash
ng serve --source-map
```

### Check bundle size
```bash
npm run build -- --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/merzy/stats.json
```

## 📚 Documentation Files

- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - Project architecture overview
- **BEST_PRACTICES.md** - Angular & Tailwind best practices

## 🆘 Troubleshooting

### Port 4200 already in use?
```bash
ng serve --port 4201
```

### Clear cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
npm run build -- --verbose
```

## 🚀 Next Steps

1. **Explore the code** - Check out `src/app/features/`
2. **Add a new feature** - Create a new component
3. **Connect to API** - Update services with HTTP calls
4. **Deploy** - Push to production

## 📖 Resources

- [Angular Docs](https://angular.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [PrimeNG Docs](https://primeng.org/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 💡 Tips

- Use `ng generate` for scaffolding
- Keep components small and focused
- Use services for shared logic
- Leverage Tailwind utilities
- Test early and often
- Check the browser console for errors

Happy coding! 🎉
