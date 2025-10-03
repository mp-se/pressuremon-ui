import purgecss from '@fullhuman/postcss-purgecss'
import cssnano from 'cssnano'

export default {
  plugins: [
    purgecss.default({
      content: [
        './index.html',
        './pressuremon.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './src/**/*.html'
      ],
      
      // Prevent removal of rules containing Bootstrap theme selectors
      blocklist: [],
      
      // Advanced extractor that preserves Bootstrap theme attributes
      extractors: [
        {
          extractor: content => {
            // Extract standard classes
            const classes = content.match(/[\w-/:]+(?<!:)/g) || []
            
            // Always preserve these Bootstrap theme-related tokens
            const themeTokens = [
              'data-bs-theme', 
              '[data-bs-theme="dark"]', 
              '[data-bs-theme="light"]'
            ]
            
            return [...classes, ...themeTokens]
          },
          extensions: ['html', 'vue', 'js', 'ts']
        }
      ],
      
      safelist: [
        // Bootstrap Layout
        /^container(-fluid)?$/,
        /^row$/,
        /^col(-.*)?$/,
        /^g[xy]?-\d+$/,
        
        // Bootstrap Components
        /^btn(-.*)?$/,
        /^badge(-.*)?$/,
        /^spinner(-.*)?$/,
        /^form(-.*)?$/,
        /^input(-.*)?$/,
        /^select(-.*)?$/,
        /^textarea(-.*)?$/,
        /^card(-.*)?$/,
        /^nav(-.*)?$/,
        /^navbar(-.*)?$/,
        /^dropdown(-.*)?$/,
        /^modal(-.*)?$/,
        /^alert(-.*)?$/,
        /^progress(-.*)?$/,
        /^table(-.*)?$/,
        
        // Bootstrap Utilities
        /^d(-.*)?$/,
        /^p[xytblr]?-\d+$/,
        /^m[xytblr]?-\d+$/,
        /^text(-.*)?$/,
        /^bg(-.*)?$/,
        /^border(-.*)?$/,
        /^w(-.*)?$/,
        /^h(-.*)?$/,
        /^position(-.*)?$/,
        /^top-\d+$/,
        /^start-\d+$/,
        /^end-\d+$/,
        /^bottom-\d+$/,
        /^justify(-.*)?$/,
        /^align(-.*)?$/,
        /^flex(-.*)?$/,
        /^float(-.*)?$/,
        /^rounded(-.*)?$/,
        /^shadow(-.*)?$/,
        /^opacity(-.*)?$/,
        /^overflow(-.*)?$/,
        /^z(-.*)?$/,
        
        // Typography
        /^h[1-6]$/,
        /^display-\d+$/,
        /^fs(-.*)?$/,
        /^fw(-.*)?$/,
        /^lh(-.*)?$/,
        /^font(-.*)?$/,
        /^lead$/,
        /^mark$/,
        /^small$/,
        
        // Interactive states
        'active',
        'disabled',
        'show',
        'hide',
        'fade',
        'collapse',
        'collapsed',
        'collapsing',
        
        // Form validation
        'needs-validation',
        'was-validated',
        'is-valid',
        'is-invalid',
        'valid-feedback',
        'invalid-feedback',
        
        // Link utilities
        /^link(-.*)?$/,
        
        // Additional classes found in codebase
        'btn-close',
        'vr', // Vertical rule
        'align-center',
        'align-items-center', 
        /^mx-.*$/,
        /^my-.*$/,
        'overflow-hidden',
        'btn-outline-info',
        'btn-sm',
        'navbar-toggler',
        'navbar-toggler-icon',
        'navbar-brand',
        'navbar-collapse',
        'navbar-nav',
        'nav-item',
        'nav-link',
        'dropdown-toggle',
        'dropdown-menu',
        'dropdown-item',
        /^h-\d+$/,
        /^alert-dismissible$/,
        
        // Dynamically generated classes from components
        /^bg-.*-subtle$/,
        /^text-bg-.*$/,
        
        // Bootstrap dark mode theme selectors and attributes
        'data-bs-theme',
        
        // CSS custom properties (CSS variables) used by Bootstrap themes
        /^--bs-.*/,
        
        // Bootstrap theme attribute patterns - these are critical for dark mode
        /^\[data-bs-theme.*?\].*$/,
        /.*\[data-bs-theme="dark"\].*/,
        /.*\[data-bs-theme="light"\].*/,
        
        // Color scheme media queries for system dark mode detection
        /@media.*prefers-color-scheme.*/,
        
        // Bootstrap color utilities that change with theme
        /^text-.*$/,
        /^bg-.*$/,
        /^border-.*$/,
        /^btn-.*$/
      ],
      // Standard extraction to catch more classes
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      // Preserve CSS variables and keyframes (critical for Bootstrap themes)
      variables: false, // Keep CSS variables for Bootstrap themes
      keyframes: true,
      
      // Don't remove CSS rules that contain Bootstrap theme selectors
      fontFace: false,
      
      // Keep rejected selectors for debugging if needed
      rejected: false
    }),
    // Additional CSS optimization (safer for Bootstrap themes)
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: false, // Don't merge rules that might break Bootstrap themes
        minifySelectors: false, // Don't minify attribute selectors like [data-bs-theme]
        reduceTransforms: true,
        // Preserve CSS custom properties used by Bootstrap themes
        discardUnused: false,
        mergeIdents: false
      }]
    })
  ]
}