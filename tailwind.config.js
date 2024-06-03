/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
     "Nor":["Product-Nor"],
     "Brand-reg":["Product-Brand"],
     "Brnad-thin":["Product-Brand-Thin"],
     "Brnad-medium":["Product-Brand-Medium"]
    }
  },
  plugins: [],
}

