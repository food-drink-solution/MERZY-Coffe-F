# MERZY - Architecture Guide

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces and types
│   │   ├── services/        # Business logic and API calls
│   │   └── guards/          # Route guards (future)
│   ├── features/            # Feature modules (lazy-loaded)
│   │   ├── hero/
│   │   ├── story/
│   │   ├── process/
│   │   └── delivery/
│   ├── shared/              # Shared components and utilities
│   │   ├── footer/
│   │   └── components/
│   ├── app.component.ts     # Root component
│   ├── app.config.ts        # App configuration
│   └── app.routes.ts        # Routing configuration
├── environments/            # Environment-specific configs
├── styles.css              # Global styles with Tailwind
└── index.html              # Entry point
```

## Key Principles

### 1. Standalone Components
All components are standalone, following Angular 18+ best practices. No NgModules required.

### 2. Reactive Architecture
- Uses RxJS Observables for state management
- BehaviorSubjects for shared state
- Proper subscription management

### 3. Separation of Concerns
- **Core**: Business logic, services, models
- **Features**: Feature-specific components
- **Shared**: Reusable components and utilities

### 4. Styling Strategy
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Global animations and component-specific styles
- **PrimeNG**: Enterprise UI components (when needed)

## Services

### CoffeeService
Manages all coffee-related data:
- Coffee origins
- Roast levels
- Brewing methods
- Delivery options
- Selected state management

## Components

### HeroComponent
Landing section with navigation and call-to-action.

### StoryComponent
Brand story and value propositions.

### ProcessComponent
Interactive bean-to-mug journey with:
- Roast level selector
- Brewing method tabs
- Real-time visual feedback

### DeliveryComponent
MERZY delivery checker with dynamic pricing.

### FooterComponent
Navigation and company information.

## Best Practices Implemented

1. **Type Safety**: Full TypeScript with strict mode
2. **Performance**: OnPush change detection ready
3. **Accessibility**: Semantic HTML, ARIA labels
4. **Responsive Design**: Mobile-first approach
5. **Code Organization**: Clear folder structure
6. **Reusability**: Shared components and services
7. **Environment Config**: Separate dev/prod configs
8. **Linting**: ESLint configuration included

## Development Workflow

### Running the App
```bash
npm start
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Future Enhancements

1. Add route guards for protected pages
2. Implement HTTP interceptors for API calls
3. Add state management (NgRx/Akita)
4. Implement lazy loading for features
5. Add unit and e2e tests
6. Implement PWA capabilities
7. Add analytics integration
