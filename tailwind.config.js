/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stock-background': '#f4f4f4',
        'stock-primary': '#2c3e50',
        'stock-accent': '#3498db'
      }
    },
  },
  plugins: [],
}