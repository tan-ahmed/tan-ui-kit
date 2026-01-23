import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dts from 'vite-plugin-dts'
import { copyFileSync, existsSync, writeFileSync, readFileSync } from 'fs'

// Plugin to preserve pre-generated CSS and copy styles.d.ts
const preserveCSSAndTypes = () => {
  let cssBackup: string | null = null
  
  return {
    name: 'preserve-css-and-types',
    buildStart() {
      // Backup the pre-generated CSS before build
      const cssPath = path.resolve(__dirname, 'dist/tan-ui-kit.css')
      if (existsSync(cssPath)) {
        cssBackup = readFileSync(cssPath, 'utf-8')
      }
    },
    writeBundle() {
      // Restore the pre-generated CSS after build
      if (cssBackup) {
        const cssPath = path.resolve(__dirname, 'dist/tan-ui-kit.css')
        writeFileSync(cssPath, cssBackup)
      }
      
      // Copy styles.d.ts
      const srcFile = path.resolve(__dirname, 'src/styles.d.ts')
      const destFile = path.resolve(__dirname, 'dist/styles.d.ts')
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
    tailwindcss(),
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
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
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
          // Don't generate CSS in lib build - we use the pre-generated one from build:css
          if (assetInfo.name === 'style.css') return 'tan-ui-kit-temp.css'
          return assetInfo.name || 'asset'
        }
      }
    },
    cssCodeSplit: false,
  }
})
