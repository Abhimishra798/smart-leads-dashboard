/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f0ff',
          100: '#e2e1ff',
          200: '#cac8fe',
          300: '#a9a4fc',
          400: '#8a7ff8',
          500: '#7c6cf1',
          600: '#6d4fe6',
          700: '#5e3dcb',
          800: '#4e33a5',
          900: '#422d84',
          950: '#261a50',
        },
        surface: {
          900: '#0f0f1a',
          800: '#16162a',
          700: '#1e1e35',
          600: '#252542',
          500: '#2e2e50',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
