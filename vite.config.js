import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    preprocessorOptions: {
      scss: {
        // Suppress Sass deprecation warnings from Bootstrap
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        logger: {
          warn: function(message) {
            // Suppress Bootstrap-related deprecation warnings
            if (message.includes('bootstrap') || 
                message.includes('@import') || 
                message.includes('mix(') ||
                message.includes('red(') ||
                message.includes('green(') ||
                message.includes('blue(') ||
                message.includes('unit(')) {
              return;
            }
            console.warn(message);
          }
        }
      }
    },
    postcss: {
      plugins: [
        // Autoprefixer for vendor prefixes
        autoprefixer({
          overrideBrowserslist: [
            'Chrome >= 60',
            'Firefox >= 60', 
            'Safari >= 12',
            'Edge >= 79'
          ]
        }),
        
        // PurgeCSS for ESP32 optimization - only in production builds
        ...(mode === 'production' ? [purgeCSSPlugin({
          content: [
            './index.html',
            './src/**/*.{vue,js,ts}',
            './dist/**/*.{html,js}'
          ],
          safelist: [
            // Dynamic classes that might not be detected
            'show', 'hide', 'fade', 'active', 'disabled', 'collapse', 'collapsing',
            'modal-backdrop', 'modal-open', 'dropdown-toggle', 'dropdown-menu',
            'btn-close', 'modal-lg', 'modal-sm', 'modal-xl',
            'is-valid', 'is-invalid', 'valid-feedback', 'invalid-feedback',
            // Spinner classes for loading states
            'spinner-border', 'spinner-border-sm',
            // Navbar classes
            'navbar', 'navbar-expand-lg', 'navbar-dark', 'navbar-light', 'navbar-toggler',
            'navbar-toggler-icon', 'navbar-brand', 'navbar-nav', 'navbar-collapse',
            'nav-item', 'nav-link', 'dropdown-toggle',
            // Helper classes
            'vr', 'fw-bold', 'fw-normal', 'fw-light',
            // Form states
            'needs-validation', 'was-validated',
            // Alert states
            /^alert-/, /^btn-/, /^bg-/, /^text-/, /^badge-/,
            // Bootstrap utility patterns we might use dynamically
            /^d-/, /^p-/, /^m-/, /^justify-/, /^align-/,
            // Width/height utilities
            /^w-/, /^h-/, /^mw-/, /^mh-/,
            // Overflow utilities
            /^overflow-/, /^text-overflow-/,
            // Link utilities
            /^link-/, /^opacity-/,
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          variables: true, // Remove unused CSS variables too
          fontFace: false, // Keep font faces
          keyframes: true, // Remove unused keyframes
        })] : []),
        
        // CSSnano for Bootstrap CSS optimization  
        cssnano({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            colormin: true,
            minifySelectors: true,
            minifyFontValues: true,
            mergeLonghand: true,
            mergeRules: true,
            discardDuplicates: true,
            discardEmpty: true,
            discardOverridden: true,
            normalizeString: true,
            normalizeUrl: true,
            // Bootstrap-specific optimizations
            reduceTransforms: true,
            convertValues: true,
            normalizeCharset: true,
            normalizeDisplayValues: true,
            normalizePositions: true
          }]
        })
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
}))
