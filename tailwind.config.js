/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Exact palette sampled from the client's existing website
        forest: "#43952D",
        forestdeep: "#2F681F",
        cream: "#F1E9D4",
        paper: "#F8F5EC",
        ink: "#1C3D2C",
      },
    },
  },
  plugins: [],
};
