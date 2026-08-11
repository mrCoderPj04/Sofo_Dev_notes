/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070a11',
          900: '#0b0f19',
          850: '#0f1624',
          800: '#141c2e',
          700: '#1e293b',
          600: '#334155'
        },
        brand: {
          cyan: '#00f0ff',
          purple: '#8a2be2',
          blue: '#3b82f6'
        }
      },
      backgroundImage: {
        'glass-radial': 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.12), transparent 70%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #00f0ff 0%, #8a2be2 100%)',
        'brand-glow': 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%)'
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 240, 255, 0.25)',
        'purple-glow': '0 0 20px rgba(138, 43, 226, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
