# MERZY - Setup & Development Guide

## Prerequisites

- Node.js 18+ (v22.14.0 recommended)
- npm 10+
- Angular CLI 18+

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Verify installation**
   ```bash
   ng version
   ```

## Development Server

Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

### Core Architecture
- **Standalone Components**: All components are standalone (Angular 18+)
- **Reactive Programming**: RxJS Observables for state management
- **Type-Safe**: Full TypeScript with strict mode enabled

### Folder Organization
```
src/app/
├── core/              # Services, models, guards
├── features/          # Feature components
├── shared/            # Shared components
└── app.component.ts   # Root component
```

## Styling

### Tailwind CSS
- Configured with custom color palette
- Custom animations and utilities
- Responsive design utilities

### Custom Styles
- Global animations in `styles.css`
- Component-specific styles in component files
- CSS variables for theming

## Key Technologies

- **Angular 18**: Latest Angular framework
- **Tailwind CSS**: Utility-first CSS framework
- **PrimeNG 18**: Enterprise UI components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming

## Configuration Files

- `angular.json`: Angular CLI configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `.eslintrc.json`: ESLint configuration
- `postcss.config.js`: PostCSS configuration

## Environment Configuration

- `src/environments/environment.ts`: Development config
- `src/environments/environment.prod.ts`: Production config

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm test`: Run unit tests (when configured)
- `npm run e2e`: Run e2e tests (when configured)

## Deployment

### Build Optimization
```bash
npm run build -- --configuration production
```

### Deployment Targets
- **Vercel**: Zero-config deployment
- **Firebase Hosting**: Google Cloud integration
- **AWS S3 + CloudFront**: Enterprise solution

## Troubleshooting

### Port Already in Use
```bash
ng serve --port 4201
```

### Clear Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
npm run build -- --verbose
```

## Performance Tips

1. Use OnPush change detection
2. Implement lazy loading for routes
3. Optimize images with proper formats
4. Use trackBy in *ngFor loops
5. Implement virtual scrolling for large lists

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the established folder structure
2. Use TypeScript strict mode
3. Write meaningful commit messages
4. Test components before committing
5. Follow Angular style guide

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PrimeNG Documentation](https://primeng.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
