// Script to generate CSS with all utility classes and copy to dist
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
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
    const distCssPath = resolve(distDir, 'tan-ui-kit.css')
    writeFileSync(distCssPath, fullCSS)
    console.log('✅ Copied generated CSS with all utility classes to dist/tan-ui-kit.css')
    
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
