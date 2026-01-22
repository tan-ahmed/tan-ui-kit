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
