/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B0000',
        'primary-light': '#B22222',
        'primary-dark': '#5C0000',
        accent: '#F4C430',
        'accent-light': '#F7D44A',
        success: '#00C853',
        loss: '#FF1744',
        surface: '#0D0D0D',
        'surface-light': '#1A1A1A',
        'surface-lighter': '#242424',
        border: '#2A2A2A',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A0A0A0',
        'text-muted': '#666666',
        glass: 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
