/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d0ff',
          300: '#9eb2ff',
          400: '#7a8fff',
          500: '#5a6fff',
          600: '#3b4fff',
          700: '#2c3de0',
          800: '#2432b4',
          900: '#1e2a8e',
        },
        dark: {
          50:  '#f8f8f8',
          100: '#e8e8e8',
          200: '#c8c8c8',
          300: '#a0a0a0',
          400: '#787878',
          500: '#505050',
          600: '#303030',
          700: '#202020',
          800: '#141414',
          900: '#0a0a0a',
          950: '#050505',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(90, 111, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(90, 111, 255, 0.4)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #141428 50%, #0a0a0a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(90,111,255,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(90,111,255,0.5)' },
        },
      },
    },
  },
  plugins: [],
}
