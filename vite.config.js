import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Remove comments in production
          comments: false
        }
      }
    }), 
    // Gzip compression - ESP32 friendly
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false // Keep original files for fallback
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        // Autoprefixer for vendor prefixes
        autoprefixer()
      ]
    }
  },
  build: {
    minify: 'terser', // Enable minification with terser
    cssCodeSplit: false, // Disable CSS code splitting for single bundle
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Inline all imports into single file
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    // Additional build optimizations
    target: 'es2018', // Updated target for better tree shaking
    cssTarget: 'chrome80', // Updated CSS target
    chunkSizeWarningLimit: 1000, // Increase warning limit
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        passes: 3, // More passes for ESP32 (smaller files more important)
        unsafe: true, // More aggressive compression for smaller size
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true
      },
      mangle: {
        safari10: true, // Fix Safari 10 compatibility
        toplevel: true // Mangle top-level variable names for smaller size
      }
    }
  }
})
