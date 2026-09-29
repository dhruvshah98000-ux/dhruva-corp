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
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        ff: {
          red: '#ff2a4b',
          darkred: '#b91c1c',
          orange: '#ff6b00',
          gold: '#f59e0b',
        },
        cyber: {
          cyan: '#00f0ff',
          neon: '#00ff88',
          purple: '#b026ff',
          pink: '#ff007a',
          amber: '#ffaa00',
          red: '#ff2a4b',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          850: '#0c1324',
          900: '#070b16',
          950: '#04060c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(90, 111, 255, 0.35)',
        'glow-lg': '0 0 40px rgba(90, 111, 255, 0.55)',
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.4)',
        'glow-green': '0 0 25px rgba(0, 255, 136, 0.4)',
        'glow-purple': '0 0 25px rgba(176, 38, 255, 0.4)',
        'glow-pink': '0 0 25px rgba(255, 0, 122, 0.4)',
        card: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(circle at 50% 0%, rgba(67, 83, 255, 0.18) 0%, rgba(7, 11, 22, 0.8) 50%, #04060c 100%)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(67,83,255,0.15) 0%, rgba(0,240,255,0.08) 50%, rgba(176,38,255,0.12) 100%)',
        'mesh-glow': 'radial-gradient(at 0% 0%, rgba(99,102,241,0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0,240,255,0.15) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out infinite 2s',
        'shimmer': 'shimmer 2.5s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(90,111,255,0.25)' },
          '50%': { boxShadow: '0 0 35px rgba(90,111,255,0.65)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
