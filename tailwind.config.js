/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#5EEAD4',
          600: '#2DD4BF'
        }
      }
    }
  },
  plugins: []
};
