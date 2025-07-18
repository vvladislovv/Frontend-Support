/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'touch': '44px',
        'touch-lg': '48px',
      },
      fontSize: {
        'mobile-xs': ['12px', '16px'],
        'mobile-sm': ['14px', '20px'],
        'mobile-base': ['16px', '24px'],
        'mobile-lg': ['18px', '28px'],
        'mobile-xl': ['20px', '32px'],
      },
      borderRadius: {
        'mobile': '12px',
        'mobile-lg': '16px',
        'mobile-xl': '20px',
      },
      boxShadow: {
        'mobile': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'mobile-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'mobile-xl': '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 0.6s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      colors: {
        'tg': {
          'bg': 'var(--tg-theme-bg-color, #ffffff)',
          'text': 'var(--tg-theme-text-color, #000000)',
          'hint': 'var(--tg-theme-hint-color, #999999)',
          'link': 'var(--tg-theme-link-color, #3b82f6)',
          'button': 'var(--tg-theme-button-color, #3b82f6)',
          'button-text': 'var(--tg-theme-button-text-color, #ffffff)',
          'secondary-bg': 'var(--tg-theme-secondary-bg-color, #f1f5f9)',
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
    function({ addUtilities }) {
      const newUtilities = {
        '.safe-area-inset-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-inset-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-area-inset-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-area-inset-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.touch-manipulation': {
          touchAction: 'manipulation',
        },
        '.overscroll-none': {
          overscrollBehavior: 'none',
        },
        '.webkit-overflow-scrolling-touch': {
          '-webkit-overflow-scrolling': 'touch',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  daisyui: {
    themes: [
      {
        telegram: {
          "primary": "var(--tg-theme-button-color, #3b82f6)",
          "secondary": "#f1f5f9",
          "accent": "#3b82f6",
          "neutral": "#374151",
          "base-100": "var(--tg-theme-bg-color, #ffffff)",
          "base-200": "var(--tg-theme-secondary-bg-color, #f1f5f9)",
          "base-300": "#e5e7eb",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
    ],
    base: true,
    styled: true,
    utils: true,
  },
} 