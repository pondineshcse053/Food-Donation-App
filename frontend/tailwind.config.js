/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        annam: {
          dark: '#0a291b',
          forest: '#0f3825',
          forestLight: '#144d33',
          sage: '#e7f0e4',
          sageLight: '#f3f7f0',
          sageBorder: '#cce0c6',
          amber: '#f29913',
          amberDark: '#d97706',
          amberLight: '#fef3c7',
          cream: '#fdfbf7',
          mint: '#dcfce7',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#0f3825',
          900: '#0a291b',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
