# Contributing to MERZY

Thank you for your interest in contributing to MERZY! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites
- Node.js 18+ (v22.14.0 recommended)
- npm 10+
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/merzy.git
   cd merzy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## Development Workflow

### Before You Start
- Check existing issues and pull requests
- Create an issue for your feature/bug fix
- Discuss your approach in the issue

### Making Changes

1. **Follow the code style**
   - Use TypeScript strict mode
   - Follow Angular style guide
   - Use meaningful variable names
   - Add comments for complex logic

2. **Keep commits clean**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue"
   git commit -m "docs: update documentation"
   ```

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

### Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions/changes
- `chore:` - Build/dependency updates

Example:
```
feat: add origin selection map to process component

- Implement interactive map with clickable origin points
- Add geographic positioning calculations
- Update CoffeeService with origin data
```

## Pull Request Process

1. **Update documentation**
   - Update README.md if needed
   - Add comments to complex code
   - Update docs/ if adding features

2. **Test thoroughly**
   - Run linter: `npm run lint`
   - Build: `npm run build`
   - Test manually on different screen sizes

3. **Create pull request**
   - Use the PR template
   - Link related issues
   - Describe changes clearly
   - Add screenshots for UI changes

4. **Address feedback**
   - Respond to review comments
   - Make requested changes
   - Push updates to your branch

## Project Structure

```
merzy/
├── src/
│   ├── app/
│   │   ├── core/          # Services & models
│   │   ├── features/      # Feature components
│   │   ├── shared/        # Shared components
│   │   └── app.component.ts
│   ├── styles.css         # Global styles
│   └── index.html         # Entry point
├── docs/                  # Documentation
├── .github/               # GitHub config
└── package.json
```

## Component Guidelines

### Creating a New Component

1. **Use standalone components**
   ```typescript
   @Component({
     selector: 'app-my-component',
     standalone: true,
     imports: [CommonModule],
     template: `...`,
     styles: [`...`]
   })
   ```

2. **Follow naming conventions**
   - Components: `MyComponent`
   - Files: `my.component.ts`
   - Selectors: `app-my-component`

3. **Add proper typing**
   - Use TypeScript interfaces
   - Avoid `any` type
   - Use strict mode

4. **Make it responsive**
   - Mobile-first approach
   - Use Tailwind breakpoints
   - Test on multiple devices

## Styling Guidelines

- Use Tailwind CSS utilities
- Follow the color scheme
- Maintain consistency
- Test on different themes

## Documentation

- Update README.md for major changes
- Add JSDoc comments to functions
- Document complex logic
- Keep docs/ updated

## Testing

- Write unit tests for services
- Test components manually
- Check responsive design
- Verify accessibility

## Performance

- Keep bundle size minimal
- Optimize images
- Use lazy loading
- Monitor performance metrics

## Security

- Don't commit secrets
- Validate user input
- Use secure dependencies
- Report vulnerabilities privately

## Questions?

- Check existing documentation
- Search closed issues
- Ask in new issue
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to MERZY!
