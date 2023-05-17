const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
    colors: {
      "nav-gray": "#D9D9D9",
      "mid-gray": "#C6C5B9",
      "side-white": "#FDFDFF",
      transparent: "transparent",
      current: "currentColor",
      "nav-gray": "#D9D9D9",
      "side-white": "#FDFDFF",
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      turquoise: "#52A1A3",
      red: "#DC244B",
      clothing: "#FCED29",
      dining_out: "#FBB03B",
      education: "#F15A25",
      electronics: "#ED1B24",
      "fast-food": "#C2272F",
      gifts: "#93268F",
      groceries: "#652D92",
      household: "#2D3194",
      internet_n_phone: "#0071BD",
      loans: "#2AABE4",
      medical: "#01A89E",
      personal: "#23B574",
      pet: "#006837",
      rent: "#019247",
      subscriptions: "#3AB54D",
      transportation: "#8DC640",
      selected: "#62929E",
      unselected: "#CED4DA",
      orange: "#F05A29",
      sidebar: "#F1F3F4",
      borderSidebar: "#D7DDE2",
      "base-white": "#F8F9FA",
      buttonHover: "#327C8F",
      linkHover: "#57626E",
    },
  },

  safelist: [
    "bg-clothing",
    "bg-dining_out",
    "bg-education",
    "bg-electronics",
    "bg-fast-food",
    "bg-gifts",
    "bg-groceries",
    "bg-household",
    "bg-internet_n_phone",
    "bg-loans",
    "bg-medical",
    "bg-personal",
    "bg-pet",
    "bg-rent",
    "bg-subscriptions",
    "bg-transportation",
    "bg-selected",
    "bg-unselected",
    "bg-sidebar",
    "border-borderSidebar",
    "bg-base-white",
    "bg-buttonHover",
    "text-linkHover",
  ],

  plugins: [
    function ({ addBase, theme }) {
      addBase({
        body: {
          backgroundColor: "#B5C2C9",
          color: "#212529",
        },
        h1: {
          fontSize: theme("fontSize.2xl"),
          fontWeight: theme("fontWeight.bold"),
        },
      });
    },
  ],
};
