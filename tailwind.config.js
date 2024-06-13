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
     "Brand-thin":["Product-Brand-Thin"],
     "Brand-medium":["Product-Brand-Medium"]
    }
  },
  plugins: [],
}

