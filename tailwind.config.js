/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#4ECDC4',
          600: '#14b8a6',
          700: '#0d9488',
          800: '#0f766e',
          900: '#115e59',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B6B',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        background: '#FAF9F7',
        darkBg: '#1A1A2E',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        display: ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        mono: ['"DIN Alternate"', '"Roboto"', 'monospace'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'gradient': '0 4px 20px rgba(78, 205, 196, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(78, 205, 196, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(78, 205, 196, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
