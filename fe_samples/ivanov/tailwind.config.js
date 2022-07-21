/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "540px",
      md: "920px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "active": "#FF8A00",
        "color-text-normal": "#6D6F8A",
        "color-text-placeholder": "#A9ABB9",
        "color-text-gray": "#9094BB",
        "color-text-number": "#606279",
        "color-text-card-title": "#B0B2D6",

        "color-background-normal": "#EDEDF3",
        "color-background-body": "#F8F8F9"
      }
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".navbar-shadow": {
          boxShadow: "0px -2px 9px #e1e1e9"
        },
        ".navbar-border-transparent": {
          borderTop: '4px solid transparent'
        },
        ".mobile-screen-height": { 
          height: 'calc(100vh - 60px)'
        }
      });
    }
  ],
}
