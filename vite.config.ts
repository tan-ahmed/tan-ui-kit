/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import dts from "vite-plugin-dts";
import { copyFileSync, existsSync, writeFileSync, readFileSync } from "fs";

// Plugin to preserve pre-generated CSS and copy styles.d.ts
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const preserveCSSAndTypes = (): Plugin => {
  let cssBackup: string | null = null;
  return {
    name: "preserve-css-and-types",
    buildStart() {
      // Backup the pre-generated CSS before build
      const cssPath = path.resolve(__dirname, "dist/tan-ui-kit.css");
      if (existsSync(cssPath)) {
        cssBackup = readFileSync(cssPath, "utf-8");
      }
    },
    writeBundle() {
      // Restore the pre-generated CSS after build
      if (cssBackup) {
        const cssPath = path.resolve(__dirname, "dist/tan-ui-kit.css");
        writeFileSync(cssPath, cssBackup);
      }

      // Copy styles.d.ts
      const srcFile = path.resolve(__dirname, "src/styles.d.ts");
      const destFile = path.resolve(__dirname, "dist/styles.d.ts");
      if (existsSync(srcFile)) {
        copyFileSync(srcFile, destFile);
      } else {
        // Create it if it doesn't exist
        const content = `// Type declaration for styles import\ndeclare const styles: string;\nexport default styles;\n`;
        writeFileSync(destFile, content);
      }
    }
  };
};

// Plugin to preserve "use client" directive in build output
const preserveUseClient = (): Plugin => {
  return {
    name: "preserve-use-client",
    writeBundle() {
      // Add "use client" to the ES module output (Next.js uses ES modules)
      const esmPath = path.resolve(__dirname, "dist/tan-ui-kit.es.js");
      if (existsSync(esmPath)) {
        const content = readFileSync(esmPath, "utf-8");
        // Only add if it's not already there
        if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
          writeFileSync(esmPath, '"use client";\n' + content);
        }
      }
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({
    include: ["src/**/*"],
    exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/styles.d.ts", "src/main.tsx", "src/App.tsx", "src/App.css", "src/index.css", "src/build-styles.tsx"],
    outDir: "dist",
    insertTypesEntry: true,
    tsconfigPath: "./tsconfig.app.json"
  }), preserveCSSAndTypes(), preserveUseClient()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "TanUIKit",
      formats: ["es", "cjs"],
      fileName: format => `tan-ui-kit.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime"
        },
        assetFileNames: assetInfo => {
          // Don't generate CSS in lib build - we use the pre-generated one from build:css
          if (assetInfo.name === "style.css") return "tan-ui-kit-temp.css";
          return assetInfo.name || "asset";
        }
      }
    },
    cssCodeSplit: false
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});