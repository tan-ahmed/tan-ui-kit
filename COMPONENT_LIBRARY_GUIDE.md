# Component Library Setup Guide

A complete guide to creating a React component library with Tailwind CSS v4, TypeScript, and Vite from scratch.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Project Structure](#project-structure)
3. [Dependencies](#dependencies)
4. [TypeScript Configuration](#typescript-configuration)
5. [Vite Configuration](#vite-configuration)
6. [CSS Generation Setup](#css-generation-setup)
7. [Component Development](#component-development)
8. [Build Configuration](#build-configuration)
9. [Package Configuration](#package-configuration)
10. [Publishing](#publishing)

---

## Initial Setup

### 1. Create Project Directory

```bash
mkdir my-component-library
cd my-component-library
npm init -y
```

### 2. Update package.json

Set the package name, version, and type:

```json
{
  "name": "@your-org/your-library",
  "version": "0.1.0",
  "description": "A React component library built with Tailwind CSS v4",
  "type": "module",
  "main": "./dist/your-library.cjs.js",
  "module": "./dist/your-library.es.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "npm run build:css && vite build",
    "build:css": "vite build --config vite.css.config.ts && node scripts/build-css.js",
    "lint": "eslint .",
    "preview": "vite preview",
    "prepublishOnly": "npm run build"
  }
}
```

---

## Project Structure

Create the following directory structure:

```
my-component-library/
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── build-styles.tsx
│   ├── index.ts
│   ├── styles.css
│   └── styles.d.ts
├── scripts/
│   └── build-css.js
├── dist/
├── vite.config.ts
├── vite.css.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .npmignore
└── package.json
```

---

## Dependencies

### Install Dev Dependencies

```bash
pnpm add -D \
  @vitejs/plugin-react \
  @tailwindcss/vite \
  vite \
  vite-plugin-dts \
  typescript \
  @types/react \
  @types/react-dom \
  @types/node \
  tailwindcss@^4.0.0 \
  eslint \
  typescript-eslint
```

### Install Peer Dependencies (for development)

```bash
pnpm add \
  react \
  react-dom \
  @radix-ui/react-slot \
  class-variance-authority \
  clsx \
  tailwind-merge
```

### Update package.json with Peer Dependencies

```json
{
  "peerDependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwind-merge": "^2.5.0"
  }
}
```

---

## TypeScript Configuration

### tsconfig.json (Root)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vite.css.config.ts", "scripts"]
}
```

---

## Vite Configuration

### vite.config.ts (Main Library Build)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { copyFileSync, existsSync, writeFileSync, readFileSync } from 'fs'

// Plugin to preserve pre-generated CSS and copy styles.d.ts
const preserveCSSAndTypes = () => {
  let cssBackup: string | null = null
  
  return {
    name: 'preserve-css-and-types',
    buildStart() {
      // Backup the pre-generated CSS before build
      const cssPath = resolve(__dirname, 'dist/your-library.css')
      if (existsSync(cssPath)) {
        cssBackup = readFileSync(cssPath, 'utf-8')
      }
    },
    writeBundle() {
      // Restore the pre-generated CSS after build
      if (cssBackup) {
        const cssPath = resolve(__dirname, 'dist/your-library.css')
        writeFileSync(cssPath, cssBackup)
      }
      
      // Copy styles.d.ts
      const srcFile = resolve(__dirname, 'src/styles.d.ts')
      const destFile = resolve(__dirname, 'dist/styles.d.ts')
      if (existsSync(srcFile)) {
        copyFileSync(srcFile, destFile)
      } else {
        const content = `// Type declaration for styles import\ndeclare const styles: string;\nexport default styles;\n`
        writeFileSync(destFile, content)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/styles.d.ts', 'src/main.tsx', 'src/App.tsx', 'src/App.css', 'src/index.css', 'src/build-styles.tsx'],
      outDir: 'dist',
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.app.json',
    }),
    preserveCSSAndTypes(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YourLibrary',
      formats: ['es', 'cjs'],
      fileName: (format) => `your-library.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime'
        },
        assetFileNames: (assetInfo) => {
          // Don't generate CSS in lib build - we use the pre-generated one
          if (assetInfo.name === 'style.css') return 'your-library-temp.css'
          return assetInfo.name || 'asset'
        }
      }
    },
    cssCodeSplit: false,
  }
})
```

### vite.css.config.ts (CSS Generation Build)

```typescript
// Separate config for generating CSS with all utility classes
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add Tailwind plugin to process CSS
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-temp',
    rollupOptions: {
      input: resolve(__dirname, 'src/build-styles.tsx'),
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        assetFileNames: 'build-styles.css',
      },
    },
    cssCodeSplit: false,
    write: true,
  },
})
```

---

## CSS Generation Setup

### src/build-styles.tsx

This file renders all component variants to ensure Tailwind generates all CSS classes:

```typescript
// This file is ONLY used during build to generate CSS
// It imports all components with all variants to ensure Tailwind generates all utility classes

import './styles.css'
import { Button } from './components/ui/button'

// Render all variants to ensure CSS is generated
export default function BuildStyles() {
  return (
    <>
      <Button variant="default" size="default" />
      <Button variant="default" size="sm" />
      <Button variant="default" size="lg" />
      <Button variant="default" size="icon" />
      <Button variant="destructive" size="default" />
      <Button variant="destructive" size="sm" />
      <Button variant="destructive" size="lg" />
      <Button variant="outline" size="default" />
      <Button variant="outline" size="sm" />
      <Button variant="outline" size="lg" />
      <Button variant="secondary" size="default" />
      <Button variant="secondary" size="sm" />
      <Button variant="secondary" size="lg" />
      <Button variant="ghost" size="default" />
      <Button variant="ghost" size="sm" />
      <Button variant="ghost" size="lg" />
      <Button variant="link" size="default" />
      <Button variant="link" size="sm" />
      <Button variant="link" size="lg" />
    </>
  )
}
```

**Important:** Add all component variants here. When you add new components or variants, update this file.

### scripts/build-css.js

```javascript
// Script to generate CSS with all utility classes and copy to dist
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = resolve(__dirname, '..')

async function copyGeneratedCSS() {
  const distDir = resolve(rootDir, 'dist')
  mkdirSync(distDir, { recursive: true })
  
  // Find the CSS file (it might have a hash in the name)
  const tempDir = resolve(rootDir, 'dist-temp')
  const assetsDir = resolve(tempDir, 'assets')
  
  let cssFile = null
  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir)
    cssFile = files.find(f => f.endsWith('.css'))
    if (cssFile) {
      cssFile = resolve(assetsDir, cssFile)
    }
  }
  
  // Fallback to direct path
  if (!cssFile || !existsSync(cssFile)) {
    cssFile = resolve(tempDir, 'build-styles.css')
  }
  
  if (existsSync(cssFile)) {
    // Read and copy the generated CSS
    const fullCSS = readFileSync(cssFile, 'utf-8')
    const distCssPath = resolve(distDir, 'your-library.css')
    writeFileSync(distCssPath, fullCSS)
    console.log('✅ Copied generated CSS with all utility classes to dist/your-library.css')
    
    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true })
  } else {
    console.error('❌ CSS file not found. Checked:', cssFile)
    process.exit(1)
  }
}

copyGeneratedCSS().catch((err) => {
  console.error('Error copying CSS:', err)
  process.exit(1)
})
```

**Update:** Replace `your-library.css` with your actual library name.

### src/styles.css

```css
@import "tailwindcss";

@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(0 0% 3.9%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(0 0% 3.9%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(0 0% 3.9%);
  --color-primary: hsl(0 0% 9%);
  --color-primary-foreground: hsl(0 0% 98%);
  --color-secondary: hsl(0 0% 96.1%);
  --color-secondary-foreground: hsl(0 0% 9%);
  --color-muted: hsl(0 0% 96.1%);
  --color-muted-foreground: hsl(0 0% 45.1%);
  --color-accent: hsl(0 0% 96.1%);
  --color-accent-foreground: hsl(0 0% 9%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(0 0% 89.8%);
  --color-input: hsl(0 0% 89.8%);
  --color-ring: hsl(0 0% 3.9%);
  --radius: 0.5rem;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### src/styles.d.ts

```typescript
// Type declaration for styles import
declare const styles: string;
export default styles;
```

---

## Component Development

### src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### src/components/ui/button.tsx

Example component using `class-variance-authority`:

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### src/index.ts

```typescript
// Note: styles.css is NOT imported here - it's pre-generated during build
// The CSS is included in dist/your-library.css via the build:css script

// Export components
export { Button, buttonVariants } from './components/ui/button'
export type { ButtonProps } from './components/ui/button'
```

---

## Build Configuration

### .npmignore

```
# Source files - NOT needed (pre-generated CSS)
src/
*.ts
*.tsx
!*.d.ts

# Development files
node_modules/
.vite/
dist-temp/
*.log
.DS_Store
.env
.env.local
.env.*.local

# Build artifacts (keep dist/)
*.map
```

### package.json exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/your-library.es.js",
      "require": "./dist/your-library.cjs.js"
    },
    "./styles": {
      "types": "./dist/styles.d.ts",
      "default": "./dist/your-library.css"
    }
  }
}
```

---

## Publishing

### 1. Update Version

```bash
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

### 2. Build

```bash
npm run build
```

### 3. Publish

```bash
npm publish --access public
```

### 4. Verify Installation

In a test project:

```bash
pnpm add @your-org/your-library
```

```tsx
import { Button } from '@your-org/your-library'
import '@your-org/your-library/styles'

function App() {
  return <Button variant="destructive">Click me</Button>
}
```

---

## Key Points to Remember

1. **CSS Generation**: Always update `src/build-styles.tsx` when adding new components or variants
2. **Build Order**: CSS generation (`build:css`) must run before the main build
3. **No Source Files**: Don't include `src/` in the published package - only `dist/`
4. **Peer Dependencies**: All React and utility dependencies should be peer dependencies
5. **TypeScript**: Use separate tsconfig files for app code and build tools
6. **CSS Preservation**: The vite plugin preserves the pre-generated CSS during the main build

---

## Troubleshooting

### CSS not generating utility classes

- Check that `@tailwindcss/vite` is installed and included in `vite.css.config.ts`
- Verify all component variants are included in `src/build-styles.tsx`
- Ensure `src/styles.css` imports Tailwind: `@import "tailwindcss";`

### TypeScript errors

- Verify path aliases in `tsconfig.app.json` match vite config
- Check that `vite-plugin-dts` is configured correctly
- Ensure `src/styles.d.ts` exists and is copied to `dist/`

### Build fails

- Check that `dist-temp/` directory is cleaned up properly
- Verify CSS file path in `scripts/build-css.js` matches your library name
- Ensure all file paths use `resolve(__dirname, ...)` for cross-platform compatibility

---

## Next Steps

- Add more components following the same pattern
- Set up Storybook for component development
- Add unit tests with Vitest
- Configure CI/CD for automated publishing
- Add changelog generation
