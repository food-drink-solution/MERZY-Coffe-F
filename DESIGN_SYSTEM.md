# MERZY Design System

Complete design system documentation for the MERZY specialty coffee & bakery brand.

## Color Palette

### Brand Colors

| Token | Hex Value | RGB | Usage |
|-------|-----------|-----|-------|
| **Ink** | `#0B0812` | 11, 8, 18 | Primary text, dark elements |
| **Panel** | `#151021` | 21, 16, 33 | Dark raised surfaces, cards |
| **Accent** | `#5C0AB2` | 92, 10, 178 | Brand violet core, active states |
| **Accent Bright** | `#8E4BF0` | 142, 75, 240 | Electric violet, highlights |
| **Accent Soft** | `#C9B8FA` | 201, 184, 250 | Lavender, subtle accents |
| **Canvas** | `#F7F6FB` | 247, 246, 251 | Light page background |

### Semantic Colors

- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

## Typography

### Font Families

- **Display**: Sora (Google Fonts)
  - Weight: 600, 700
  - Use for: Headings, titles
  - Letter spacing: -0.02em

- **Body**: Outfit (Google Fonts)
  - Weight: 400, 500, 600
  - Use for: Body text, UI labels
  - Letter spacing: 0

### Font Sizes

| Size | px | rem | Use Case |
|------|----|----|----------|
| **H1** | 48 | 3rem | Main page headings |
| **H2** | 36 | 2.25rem | Section headings |
| **H3** | 28 | 1.75rem | Subsection headings |
| **H4** | 24 | 1.5rem | Card headings |
| **H5** | 20 | 1.25rem | Labels |
| **Body** | 16 | 1rem | Default text |
| **Small** | 14 | 0.875rem | Secondary text |
| **Tiny** | 12 | 0.75rem | Captions |

### Line Heights

- **Headings**: 1.2 (tight)
- **Body**: 1.5 (comfortable)
- **UI**: 1.4 (balanced)

## Spacing Scale

All spacing uses increments of 4px (Tailwind compatible):

| Size | Pixels | Tailwind |
|------|--------|----------|
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 12px | `p-3` |
| lg | 16px | `p-4` |
| xl | 24px | `p-6` |
| 2xl | 32px | `p-8` |
| 3xl | 48px | `p-12` |
| 4xl | 64px | `p-16` |

## Components

### Buttons

**Primary Button**
- Background: Accent Bright (`#8E4BF0`)
- Text: Canvas (`#F7F6FB`)
- Padding: 12px 24px (lg: 16px 32px)
- Border Radius: 8px
- Hover: Accent (`#5C0AB2`)

**Secondary Button**
- Background: Panel (`#151021`)
- Text: Canvas (`#F7F6FB`)
- Border: 1px solid Accent
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Accent background

**Ghost Button**
- Background: Transparent
- Text: Accent Bright
- Border: 1px solid Accent Bright
- Padding: 12px 24px
- Hover: Light background

### Cards

- Background: Panel (`#151021`)
- Border Radius: 12px
- Box Shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
- Padding: 24px
- Border: 1px solid rgba(142, 75, 240, 0.1)

### Forms

- Input Background: Canvas
- Input Border: 1px solid Accent Soft
- Input Text: Ink
- Focus Border: Accent Bright
- Label: Ink
- Error: Error color
- Disabled: Gray with reduced opacity

### Navigation

- Background: Panel
- Text: Canvas
- Active: Accent Bright
- Hover: Accent (20% opacity)
- Height: 64px (mobile), 80px (desktop)

## Responsive Design

### Breakpoints

| Device | Pixels | Tailwind |
|--------|--------|----------|
| Mobile | 320-768px | `sm:` |
| Tablet | 768-1024px | `md:` |
| Desktop | 1024-1280px | `lg:` |
| Wide | 1280px+ | `xl:` |

### Grid System

- 12-column grid on desktop
- 8-column on tablet
- 4-column on mobile
- 16px/24px gutter

## Accessibility

- **Color Contrast**: WCAG AA (minimum 4.5:1 for text)
- **Focus States**: Visible outline (2px solid Accent Bright)
- **Keyboard Navigation**: All interactive elements accessible
- **ARIA Labels**: Applied to all interactive components
- **Font Size**: Minimum 16px for body text
- **Touch Targets**: Minimum 44x44px

## Motion & Animation

### Transitions

- **Standard**: 200ms ease-out (UI interactions)
- **Slow**: 300ms ease-out (Page transitions)
- **Fast**: 100ms ease-out (Hover states)

### Easing Functions

- **ease-out**: Cubic-bezier(0.4, 0, 0.2, 1)
- **ease-in**: Cubic-bezier(0.4, 0, 1, 1)
- **ease-in-out**: Cubic-bezier(0.4, 0, 0.2, 1)

## Imagery

### Photography

- **Style**: Professional, warm, inviting
- **Aspect Ratios**: 16:9 (hero), 1:1 (product), 4:3 (content)
- **Processing**: Subtle warmth, high contrast
- **Source**: Real MERZY photos from Instagram, Talabat

### Icons

- **Style**: Minimal, 2px stroke weight
- **Size**: 24px (standard), 32px (large), 16px (small)
- **Color**: Accent Bright or Canvas (context dependent)
- **Library**: Custom SVG (consistent with brand)

## Brand Voice

- **Tone**: Sophisticated, approachable, passionate about quality
- **Messaging**: Focus on craftsmanship and attention to detail
- **Tagline**: "For those who value the details"

## Usage Guidelines

### DO ✅

- Use the centralized color tokens
- Follow the typography hierarchy
- Apply consistent spacing
- Maintain proper contrast ratios
- Test on multiple devices

### DON'T ❌

- Hardcode colors outside the palette
- Use system fonts instead of Sora/Outfit
- Mix token scales (use consistent spacing)
- Add custom colors without team review
- Ignore accessibility requirements

## Implementation

### CSS Variables

```css
:root {
  --merzy-ink: #0B0812;
  --merzy-panel: #151021;
  --merzy-accent: #5C0AB2;
  --merzy-accent-bright: #8E4BF0;
  --merzy-accent-soft: #C9B8FA;
  --merzy-canvas: #F7F6FB;
}
```

### Tailwind Config

```js
module.exports = {
  theme: {
    colors: {
      ink: '#0B0812',
      panel: '#151021',
      accent: '#5C0AB2',
      'accent-bright': '#8E4BF0',
      'accent-soft': '#C9B8FA',
      canvas: '#F7F6FB',
    }
  }
}
```

## Updates & Versioning

- **Version**: 1.0.0
- **Last Updated**: October 31, 2026
- **Maintained by**: MERZY Design Team

For changes or questions, please open an issue or contact the design team.
