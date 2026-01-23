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

## Usage

The package includes pre-generated CSS with all utility classes, so **no Tailwind configuration is needed** - it works out of the box!

### 1. Import styles in your entry file

Import the styles once in your main entry point file:

- **React (Vite/CRA)**: `src/main.tsx` or `src/index.tsx`
- **Next.js (App Router)**: `app/layout.tsx` or `app/page.tsx`
- **Next.js (Pages Router)**: `pages/_app.tsx`
- **TanStack Start**: `app.tsx`
- **Other frameworks**: Your main entry point file

```tsx
// In your main entry point file (e.g., src/main.tsx, app.tsx, etc.)
import "@tan-ahmed/tan-ui-kit/styles";
```

### 2. Use components anywhere

After importing the styles, you can use components anywhere in your app:

```tsx
import { Button } from "@tan-ahmed/tan-ui-kit";

function MyComponent() {
  return <Button variant="secondary">Click me</Button>;
}
```

## License

MIT
