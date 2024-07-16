/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-300': '#020024',
        'color-400': '#090979',
        'color-500': '#00D4FF',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(45deg, #020024 0%, #090979 50%, #00D4FF 100%)',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
