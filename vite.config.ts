import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { copyFileSync, existsSync, writeFileSync } from 'fs'

// Plugin to copy styles.d.ts to dist
const copyStylesTypes = () => {
  return {
    name: 'copy-styles-types',
    writeBundle() {
      const srcFile = resolve(__dirname, 'src/styles.d.ts')
      const destFile = resolve(__dirname, 'dist/styles.d.ts')
      if (existsSync(srcFile)) {
        copyFileSync(srcFile, destFile)
      } else {
        // Create it if it doesn't exist
        const content = `// Type declaration for styles import\ndeclare const styles: string;\nexport default styles;\n`
        writeFileSync(destFile, content)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/styles.d.ts', 'src/main.tsx', 'src/App.tsx', 'src/App.css', 'src/index.css'],
      outDir: 'dist',
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.app.json',
    }),
    copyStylesTypes(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TanUIKit',
      formats: ['es', 'cjs'],
      fileName: (format) => `tan-ui-kit.${format}.js`
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
          if (assetInfo.name === 'style.css') return 'tan-ui-kit.css'
          return assetInfo.name || 'asset'
        }
      }
    },
    cssCodeSplit: false,
  }
})
