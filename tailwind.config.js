/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        zen: {
          // Calm Night palette
          night: '#0a0f1e',
          'night-2': '#111827',
          'night-3': '#1a2035',
          blue: '#7c9ef5',
          lavender: '#a78bfa',
          amber: '#f0b97a',
          teal: '#5eead4',
          mist: '#e8edf5',
          subtle: '#8899aa',
          // Morning Mist palette
          dawn: '#f0f4f8',
          cloud: '#e0e7ff',
          petal: '#f3e8ff',
          sage: '#ecfdf5',
        },
      },
      backgroundImage: {
        'calm-night': 'linear-gradient(135deg, #0a0f1e 0%, #1a1035 50%, #0f1a2e 100%)',
        'morning-mist': 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #ecfdf5 100%)',
        'forest-deep': 'linear-gradient(135deg, #0a1a0f 0%, #0f2a1a 50%, #051810 100%)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'breathe-in': 'breathe-in 4s ease-in-out forwards',
        'breathe-out': 'breathe-out 4s ease-in-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 158, 245, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 158, 245, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
