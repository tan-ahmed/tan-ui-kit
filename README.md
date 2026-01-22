# @tan-ahmed/tan-ui-kit

A React component library built with Tailwind CSS v4 and shadcn/ui components.

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
pnpm add react react-dom @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Button } from '@tan-ahmed/tan-ui-kit'
import '@tan-ahmed/tan-ui-kit/styles'

function App() {
  return <Button>Click me</Button>
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
