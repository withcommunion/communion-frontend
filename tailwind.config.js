const vwMap = {
  '10vw': '10vw',
  '15vw': '15vw',
  '20vw': '20vw',
  '25vw': '25vw',
  '30vw': '30vw',
  '35vw': '35vw',
  '40vw': '40vw',
  '45vw': '45vw',
  '50vw': '50vw',
  '55vw': '55vw',
  '60vw': '60vw',
  '65vw': '65vw',
  '70vw': '70vw',
  '75vw': '75vw',
  '80vw': '80vw',
  '85vw': '85vw',
  '90vw': '90vw',
  '95vw': '95vw',
  '100vw': '100vw',
};
const vhMap = {
  '10vh': '10vh',
  '15vh': '15vh',
  '20vh': '20vh',
  '25vh': '25vh',
  '30vh': '30vh',
  '35vh': '35vh',
  '40vh': '40vh',
  '45vh': '45vh',
  '50vh': '50vh',
  '55vh': '55vh',
  '60vh': '60vh',
  '65vh': '65vh',
  '70vh': '70vh',
  '75vh': '75vh',
  '80vh': '80vh',
  '85vh': '85vh',
  '90vh': '90vh',
  '95vh': '95vh',
  '100vh': '100vh',
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: vhMap,
      maxHeight: vhMap,
      minHeight: vhMap,
      width: vwMap,
      maxWidth: vwMap,
      minWidth: vwMap,
    },
  },
  plugins: [],
};
