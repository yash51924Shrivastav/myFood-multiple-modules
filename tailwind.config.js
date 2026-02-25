/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#c2410c",
          dark: "#7c2d12",
          light: "#fdba74"
        }
      }
    }
  },
  plugins: []
}
