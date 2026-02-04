# Design System Setup From Scratch

A step-by-step guide to building a React design system from zero using **shadcn/ui**, **Tailwind CSS v4**, and **Base UI**, then packaging it as an **NPM package** that consumers can install and use without running Tailwind in their app.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Scaffold the Project](#2-scaffold-the-project)
3. [Install Tailwind CSS v4](#3-install-tailwind-css-v4)
4. [Initialize shadcn/ui](#4-initialize-shadcnui)
5. [Design System CSS & Theme](#5-design-system-css--theme)
6. [Add Your First Component](#6-add-your-first-component)
7. [Two-Phase Build: CSS Then Library](#7-two-phase-build-css-then-library)
8. [Vite Library Build Configuration](#8-vite-library-build-configuration)
9. [Package as NPM Library](#9-package-as-npm-library)
10. [Publishing & Consumer Usage](#10-publishing--consumer-usage)
11. [Checklist When Adding New Components](#11-checklist-when-adding-new-components)

---

## 1. Prerequisites

- **Node.js** 18+ (20+ recommended)
- **pnpm** (recommended), npm, or yarn
- A code editor (VS Code / Cursor)

---

## 2. Scaffold the Project

Create a Vite + React + TypeScript app. This becomes your design-system repo.

```bash
pnpm create vite my-design-system --template react-ts
cd my-design-system
pnpm install
```

Rename the folder if you like (e.g. `tan-ui-kit`). All steps below use a generic name; replace with yours.

**Optional:** Add path alias so you can use `@/` for `src/`:

- In **tsconfig.json** and **tsconfig.app.json** (if present), add under `compilerOptions`:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

- You’ll wire the same alias in Vite in a later step.

---

## 3. Install Tailwind CSS v4

Tailwind v4 uses the Vite plugin and imports in CSS (no `tailwind.config.js` by default).

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

In your main **CSS file** (e.g. `src/index.css`), add at the top:

```css
@import "tailwindcss";
```

In **vite.config.ts**, add the Tailwind plugin:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // add this
    // ...
  ],
  // ...
});
```

Run `pnpm dev` and use a class like `class="text-red-500"` in `App.tsx` to confirm Tailwind works.

---

## 4. Initialize shadcn/ui

shadcn/ui is a collection of copy-paste components that use Tailwind and (in newer setups) **Base UI** primitives. You don’t install it as a single dependency; you init the CLI and add components into your repo.

```bash
pnpm dlx shadcn@latest init
```

Answer the prompts. Typical choices:

- **Style:** e.g. Default or New York
- **Base color:** e.g. Neutral
- **CSS variables:** Yes (so you can theme with CSS vars)
- **Tailwind config:** Leave empty (v4 uses CSS-based config)
- **Tailwind CSS file:** `src/index.css`
- **Components path:** `@/components`
- **Utils path:** `@/lib/utils`
- **React Server Components:** No (for a Vite-based library)
- **Icon library:** e.g. Lucide

This creates:

- **components.json** – shadcn config (paths, Tailwind file, etc.)
- **src/lib/utils.ts** – `cn()` helper (clsx + tailwind-merge)
- Optionally **src/components/ui/** and updates to **src/index.css**

Install the helpers and primitives that shadcn uses:

```bash
pnpm add class-variance-authority clsx tailwind-merge
pnpm add @base-ui/react
```

If the init didn’t create **src/lib/utils.ts**, add it:

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Ensure **vite.config.ts** has the `@/` alias:

```ts
import path from "path";

export default defineConfig({
  // ...
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Add your first shadcn component (this will generate the component and may add CSS):

```bash
pnpm dlx shadcn@latest add button
```

You should get something like **src/components/ui/button.tsx** that uses Base UI’s `Button` and your `cn`/`buttonVariants` pattern.

---

## 5. Design System CSS & Theme

Your design system’s look-and-feel lives in one main CSS file (e.g. `src/index.css`). It should:

1. Import Tailwind and any plugins (e.g. `tw-animate-css`).
2. Define design tokens (colors, radius, etc.) with CSS variables and Tailwind v4 `@theme inline`.
3. Optionally add base styles (`@layer base`).

Example structure (Tailwind v4 + CSS variables for light/dark):

```css
/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";   /* optional: pnpm add -D tw-animate-css */

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Map CSS variables to Tailwind theme tokens */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  /* Add other semantic colors your components use */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... same pattern for other tokens */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Important: **Do not import this CSS from your library’s main entry** (e.g. `src/index.ts`). It will only be used at build time to generate a single CSS bundle (see next section).

---

## 6. Add Your First Component

You already have **src/components/ui/button.tsx** from shadcn. Ensure:

- It uses `"use client";` at the top if you plan to use the library in Next.js App Router.
- It uses `cn()` and your `buttonVariants` (CVA) with Tailwind classes that reference your theme (e.g. `bg-primary`, `text-primary-foreground`).

Create a single barrel file that will become the public API of the library:

```ts
// src/index.ts
"use client";

export { Button, buttonVariants } from "./components/ui/button";
```

Do **not** import `index.css` (or any CSS) in `index.ts`. CSS will be shipped separately as a built file.

---

## 7. Two-Phase Build: CSS Then Library

Consumers should **not** need to run Tailwind or scan your source. So we:

1. **Phase 1 – Build CSS:** A separate Vite build entry that imports your main CSS and renders every component variant so Tailwind sees every class. Output: one CSS file (e.g. `dist/my-library.css`).
2. **Phase 2 – Build JS/TS:** Normal Vite library build that bundles your `src/index.ts` (and components) into ESM + CJS. It does **not** emit CSS; we keep the file from Phase 1.

### 7.1 Build-styles entry (for CSS generation)

Create a React entry that imports your CSS and renders every variant of every component. Tailwind will then generate all those utility classes into one CSS file.

```tsx
// src/build-styles.tsx
import "./index.css";
import { Button } from "./components/ui/button";

export default function BuildStyles() {
  return (
    <>
      <Button variant="default" size="default" />
      <Button variant="default" size="sm" />
      <Button variant="default" size="lg" />
      <Button variant="default" size="icon" />
      <Button variant="destructive" size="default" />
      <Button variant="outline" size="default" />
      <Button variant="secondary" size="default" />
      <Button variant="ghost" size="default" />
      <Button variant="link" size="default" />
      {/* Add every variant/size you export for Button and any other component */}
    </>
  );
}
```

When you add new components or new variants, **update this file** so the final CSS contains all needed classes.

### 7.2 Vite config for CSS-only build

Create a second Vite config that only builds this entry and emits CSS:

```ts
// vite.css.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    outDir: "dist-temp",
    rollupOptions: {
      input: path.resolve(__dirname, "src/build-styles.tsx"),
      output: {
        format: "es",
        entryFileNames: "[name].js",
        assetFileNames: "build-styles.css",
      },
    },
    cssCodeSplit: false,
    write: true,
  },
});
```

### 7.3 Script to copy generated CSS into `dist`

The CSS build may output to `dist-temp/assets/build-styles-<hash>.css`. A small script can find that file and copy it to `dist/my-library.css` (and then remove `dist-temp`).

Example (adjust paths and library name to match yours):

```js
// scripts/build-css.js
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const LIBRARY_NAME = "my-library"; // e.g. tan-ui-kit

async function run() {
  const distDir = path.resolve(rootDir, "dist");
  mkdirSync(distDir, { recursive: true });

  const tempDir = path.resolve(rootDir, "dist-temp");
  const assetsDir = path.resolve(tempDir, "assets");

  let cssPath = null;
  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir);
    const name = files.find((f) => f.endsWith(".css"));
    if (name) cssPath = path.join(assetsDir, name);
  }
  if (!cssPath || !existsSync(cssPath)) {
    cssPath = path.join(tempDir, "build-styles.css");
  }

  if (!existsSync(cssPath)) {
    console.error("CSS file not found. Checked:", cssPath);
    process.exit(1);
  }

  const css = readFileSync(cssPath, "utf-8");
  const outPath = path.join(distDir, `${LIBRARY_NAME}.css`);
  writeFileSync(outPath, css);
  console.log("✅ Copied CSS to", outPath);

  rmSync(tempDir, { recursive: true, force: true });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

### 7.4 NPM scripts

In **package.json**:

```json
{
  "scripts": {
    "build:css": "vite build --config vite.css.config.ts && node scripts/build-css.js",
    "build": "npm run build:css && vite build",
    "prepublishOnly": "npm run build"
  }
}
```

So: `build:css` generates and copies the single CSS file into `dist/`; `build` runs that first, then the main Vite library build.

---

## 8. Vite Library Build Configuration

Your main **vite.config.ts** should:

1. Build the library from `src/index.ts` (no CSS import there).
2. Output ESM and CJS (e.g. `dist/my-library.es.js`, `dist/my-library.cjs.js`).
3. Generate TypeScript declarations (e.g. with `vite-plugin-dts`).
4. **Not** replace the pre-built CSS: keep `dist/my-library.css` from the CSS step.
5. Optionally prepend `"use client";` to the ESM bundle for Next.js.

Install the DTS plugin:

```bash
pnpm add -D vite-plugin-dts
```

Example **vite.config.ts** (replace `my-library` / `MyLibrary` with your name):

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import dts from "vite-plugin-dts";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";

const LIBRARY_NAME = "my-library";

const preserveCSSAndTypes = () => {
  let cssBackup: string | null = null;
  return {
    name: "preserve-css-and-types",
    buildStart() {
      const cssPath = path.resolve(__dirname, `dist/${LIBRARY_NAME}.css`);
      if (existsSync(cssPath)) cssBackup = readFileSync(cssPath, "utf-8");
    },
    writeBundle() {
      if (cssBackup) {
        writeFileSync(path.resolve(__dirname, `dist/${LIBRARY_NAME}.css`), cssBackup);
      }
      const srcTypes = path.resolve(__dirname, "src/styles.d.ts");
      const destTypes = path.resolve(__dirname, "dist/styles.d.ts");
      if (existsSync(srcTypes)) {
        copyFileSync(srcTypes, destTypes);
      } else {
        writeFileSync(
          destTypes,
          "declare const styles: string;\nexport default styles;\n"
        );
      }
    },
  };
};

const preserveUseClient = () => ({
  name: "preserve-use-client",
  writeBundle() {
    const esmPath = path.resolve(__dirname, `dist/${LIBRARY_NAME}.es.js`);
    if (existsSync(esmPath)) {
      const content = readFileSync(esmPath, "utf-8");
      if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
        writeFileSync(esmPath, '"use client";\n' + content);
      }
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src/**/*"],
      exclude: ["src/main.tsx", "src/App.tsx", "src/index.css", "src/build-styles.tsx"],
      outDir: "dist",
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
    preserveCSSAndTypes(),
    preserveUseClient(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyLibrary",
      formats: ["es", "cjs"],
      fileName: (format) => `${LIBRARY_NAME}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
        assetFileNames: (info) => (info.name === "style.css" ? "temp.css" : info.name || "asset"),
      },
    },
    cssCodeSplit: false,
  },
});
```

Create a minimal type declaration for the styles subpath:

```ts
// src/styles.d.ts
declare const styles: string;
export default styles;
```

The DTS plugin will copy this (or generate one) into `dist/styles.d.ts` so `import "@your-org/my-library/styles"` is typed.

---

## 9. Package as NPM Library

### 9.1 package.json (library shape)

- **name:** e.g. `@your-org/my-library`.
- **version:** e.g. `0.1.0`.
- **type:** `"module"`.
- **main** / **module** / **types:** point to `dist/` (see below).
- **exports:** entry point + styles subpath.
- **files:** only what you publish (e.g. `dist`, `README.md`).
- **peerDependencies:** `react`, `react-dom` (consumers provide these).
- **dependencies:** things your components need at runtime (e.g. `@base-ui/react`, `clsx`, `tailwind-merge`, `class-variance-authority`). Do **not** list Tailwind or Vite here.
- **devDependencies:** build tooling (vite, tailwind, types, etc.).

Example (replace names and paths):

```json
{
  "name": "@your-org/my-library",
  "version": "0.1.0",
  "description": "React design system with Tailwind CSS v4 and Base UI",
  "type": "module",
  "main": "./dist/my-library.cjs.js",
  "module": "./dist/my-library.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/my-library.es.js",
      "require": "./dist/my-library.cjs.js"
    },
    "./styles": {
      "types": "./dist/styles.d.ts",
      "default": "./dist/my-library.css"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "dev": "vite",
    "build:css": "vite build --config vite.css.config.ts && node scripts/build-css.js",
    "build": "npm run build:css && vite build",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@base-ui/react": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@vitejs/plugin-react": "^5.0.0",
    "tailwindcss": "^4.1.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0",
    "typescript": "~5.6.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 9.2 What gets published

- **Include:** `dist/` (JS, CSS, `.d.ts`), `README.md` (if you list it in `files`).
- **Exclude:** `src/`, config files, dev-only files. Use **.npmignore** (or `files` in package.json) so that only `dist` and README are published. Example **.npmignore**:

```
src/
*.ts
*.tsx
!*.d.ts
node_modules/
.git/
vite.config.ts
vite.css.config.ts
tsconfig*.json
index.html
```

So: consumers get the built JS, the pre-built CSS, and types—no Tailwind or source scanning required.

---

## 10. Publishing & Consumer Usage

### Publish (first time: scope + public)

```bash
npm login
npm publish --access public
```

For scoped packages (`@your-org/my-library`), `--access public` is required on npm.

### Consumer app

Install:

```bash
pnpm add @your-org/my-library
```

In the app’s **single** entry (e.g. `main.tsx`, `layout.tsx`, `_app.tsx`), import the design system styles once:

```ts
import "@your-org/my-library/styles";
```

Then use components:

```tsx
import { Button } from "@your-org/my-library";

export default function Page() {
  return <Button variant="secondary">Click me</Button>;
}
```

No Tailwind config or `content`/`@source` is needed in the consumer app; all component styles are in the pre-built CSS.

### Theming (optional)

Your CSS uses variables like `--primary`, `--background`, etc. Consumers can override them in their own CSS (e.g. on `:root` or `.dark`) to theme the design system without changing your package.

---

## 11. Checklist When Adding New Components

1. **Add the component** (e.g. via `pnpm dlx shadcn@latest add card`) or write it under `src/components/ui/`.
2. **Re-export** from `src/index.ts`, e.g. `export { Card, ... } from "./components/ui/card";`.
3. **Update `src/build-styles.tsx`:** Import the new component and render **every variant** (and size, etc.) so Tailwind includes all classes in the generated CSS.
4. Run **`pnpm run build`** and verify `dist/my-library.css` and the new component in `dist/*.js`.
5. **Bump version** and publish when ready.

---

## Quick Reference: Repo Layout

```
my-design-system/
├── src/
│   ├── components/ui/     # Button, Card, etc.
│   ├── lib/utils.ts       # cn()
│   ├── index.ts           # public API (no CSS import)
│   ├── index.css          # theme + Tailwind; used only at build time
│   ├── build-styles.tsx    # renders all variants for CSS build
│   ├── styles.d.ts        # types for "./styles"
│   ├── main.tsx           # dev app entry (optional)
│   └── App.tsx
├── scripts/
│   └── build-css.js       # copy CSS from dist-temp → dist
├── dist/                  # built output (gitignored; published)
│   ├── my-library.es.js
│   ├── my-library.cjs.js
│   ├── my-library.css
│   ├── index.d.ts
│   └── styles.d.ts
├── components.json         # shadcn
├── vite.config.ts         # library build
├── vite.css.config.ts     # CSS-only build
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

---

## Summary

| Step | What you do |
|------|-------------|
| 1 | Scaffold Vite + React + TS, add `@/` alias |
| 2 | Add Tailwind v4 (`@tailwindcss/vite` + `@import "tailwindcss"` in CSS) |
| 3 | Run `shadcn init`, add deps (CVA, clsx, tailwind-merge, Base UI), add button |
| 4 | Put design tokens and theme in `src/index.css`; do not import it from `index.ts` |
| 5 | Export components from `src/index.ts` with `"use client"` if needed |
| 6 | Add `build-styles.tsx` + `vite.css.config.ts` + `scripts/build-css.js`; run CSS build first |
| 7 | Configure main Vite as library build, preserve pre-built CSS and add `"use client"` to ESM |
| 8 | Set package.json exports (main + `./styles`), files, peer deps |
| 9 | Publish; consumers install and `import "@your-org/my-library/styles"` once, then use components |

After this, you have a single design-system NPM package built with shadcn/Tailwind/Base UI that ships one CSS file and works in any React app without Tailwind or extra config in the consumer project.
