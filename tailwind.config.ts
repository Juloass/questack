/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        popover: "#0f0f13",
        "popover-foreground": "#f1f1f1",
      },
    },
  },
  plugins: [],
};
