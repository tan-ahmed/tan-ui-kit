# Installation Troubleshooting

If you encounter the error `Cannot read properties of null (reading 'matches')` when installing this package, it's a known npm bug with Node.js 23.x.

## Quick Fixes

### Option 1: Use pnpm (Recommended)
```bash
pnpm add @tan-ahmed/tan-ui-kit
```

### Option 2: Use yarn
```bash
yarn add @tan-ahmed/tan-ui-kit
```

### Option 3: Use npm with legacy peer deps
```bash
npm install @tan-ahmed/tan-ui-kit --legacy-peer-deps
```

### Option 4: Clear npm cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install @tan-ahmed/tan-ui-kit
```

### Option 5: Update npm
```bash
npm install -g npm@latest
npm install @tan-ahmed/tan-ui-kit
```

## Root Cause

This error occurs due to a bug in npm's dependency resolver (arborist) when handling complex dependency trees, particularly with Node.js 23.x. The issue is triggered during dependency resolution and is not related to the package itself.

## Recommended Solution

Use **pnpm** or **yarn** instead of npm for the best experience.
