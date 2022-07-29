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
      spacing: {
        '46px': '46px',
        '7.5px': '7.5px',
        '11px': '11px',
        '6px': '6px',
        '15px': '15px',
        '4px': '4px',
        '1px': '1px',
        '155px':'155px',
        '295px':'295px',
      },
      colors: {
        'primaryGray': '#606279',
        'primaryPurple': '#6D6F8A',
        'secondaryPurple' : '#9094BB',
        'thirdGray':'#B5B6C8',
        'secondaryGray' : '#A9ABB9',
        'fourthGray':"#A3A4BA",
        'primaryLightGray' : "#EDEDF3",
        'secondaryLightGray': "#F8F8F9",
        'thirdLightGray':'#E5E5EA',
        'white' : "#ffffff",
        'primaryOrange': "#FF8A00",
        "secondaryOrange": "#FFA740",
        "thirdOrange": "#FFBE50",
        "fourthOrange": "#EAA125",
        "primaryBeige":"#FFF1E1",
        "secondaryBeige":"#FFF1E1",
      },
      fontSize: {
        '19px': '19px',
        '17px': '17px',
        '45px': '45px',
        '13px' : '13px',
        '15px' : '15px',
        '11px' : '11px',
        '12px':'12px'
      },
      boxShadow: {
        'menuShadow': '0px 37px 75px 0px rgba(0,0,0,0.59)',
        'primaryButtonShadow' : '0px 4px 16px #FFDA93',
        'primaryModalShadow' : '0px 3px 9px rgba(124, 123, 143, 0.25)'
      },
      borderRadius: {
        '23px':'23px',
        '28px':'28px',
        '4px':'4px',
        '1px':'1px',
        '3px':'3px'
      },
      borderWidth: {
        "1px":"1px"
      }
    },


  },
  plugins: [],
};
