/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#fce7f3',
        rosegold: '#b76e79',
        petal: '#f8d5e5'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(183,110,121,0.16)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
