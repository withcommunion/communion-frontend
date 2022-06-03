const vhMap = {
  '10vh': '10vh',
  '25vh': '25vh',
  '35vh': '35vh',
  '50vh': '50vh',
  '65vh': '65vh',
  '75vh': '75vh',
  '85vh': '85vh',
  '95vh': '95vh',
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: vhMap,
      maxHeight: vhMap,
    },
  },
  plugins: [],
};
