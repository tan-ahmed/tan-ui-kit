# @tan-ahmed/tan-ui-kit

A React component library built with Tailwind CSS v4 and base-ui components.

## Installation

### Recommended: Using pnpm

```bash
pnpm add @tan-ahmed/tan-ui-kit
```

### Using yarn

```bash
yarn add @tan-ahmed/tan-ui-kit
```

### Using npm

```bash
npm install @tan-ahmed/tan-ui-kit
```

**Note:** If you encounter the error `Cannot read properties of null (reading 'matches')` with npm, this is a known npm bug with Node.js 23.x. Please use one of the following workarounds:

1. Use pnpm or yarn (recommended)
2. Use `npm install --legacy-peer-deps`
3. Clear npm cache: `npm cache clean --force` and retry
4. Update npm: `npm install -g npm@latest`

See [INSTALLATION_TROUBLESHOOTING.md](./INSTALLATION_TROUBLESHOOTING.md) for more details.

## Peer Dependencies

This package requires the following peer dependencies:

- `react`: ^18.0.0 || ^19.0.0
- `react-dom`: ^18.0.0 || ^19.0.0
- `@radix-ui/react-slot`: ^1.0.2
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.1.0
- `tailwind-merge`: ^2.5.0

Make sure to install these in your project:

```bash
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

## Setup

### 1. Install Peer Dependencies

```bash
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge tailwindcss@^4.0.0
```

### 2. Configure Tailwind CSS v4

This package uses **Tailwind CSS v4**. In your main CSS file (e.g., `src/index.css` or `src/main.css`), add:

```css
@import "tailwindcss";

/* Your other styles... */
```

**That's it!** The package includes pre-generated CSS with all utility classes, so no additional configuration is needed.

### 3. Import the Component and Styles

**Important:** Import the styles in your main entry point file:

- **React (Vite/CRA)**: `src/main.tsx` or `src/index.tsx`
- **Next.js (App Router)**: `app/layout.tsx` or `app/page.tsx`
- **Next.js (Pages Router)**: `pages/_app.tsx`
- **TanStack Start**: `app.tsx`
- **Other frameworks**: Your main entry point file

```tsx
// In your main entry point file (e.g., src/main.tsx, app.tsx, etc.)
import "@tan-ahmed/tan-ui-kit/styles"; // ⚠️ Import this at the top of your entry file
import { Button } from "@tan-ahmed/tan-ui-kit";

function App() {
  return <Button variant="destructive">Click me</Button>;
}
```

## Usage

Import the styles once in your main entry point file (see Setup section above), then use components anywhere:

```tsx
// In your component files, you only need to import the component
import { Button } from "@tan-ahmed/tan-ui-kit";

function MyComponent() {
  return <Button variant="secondary">Click me</Button>;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
```

## License

MIT
