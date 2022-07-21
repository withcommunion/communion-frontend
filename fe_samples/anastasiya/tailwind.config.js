/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'my-gray': '#F8F8F9',
        'tokens': '#606279',
        'black-gray': '#6D6F8A'
      },
    },
    fontSize: {
      'greet': '19px',
      'balance': '17px',
      'tokenBig': '45px',
      'showAll' : '13px',
      '15px' : '15px'
    },
    boxShadow: {
      'menuShadow': '0px 37px 75px 0px rgba(0,0,0,0.59)',
    }
  },
  plugins: [],
}
