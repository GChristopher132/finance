/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Keep existing color definitions...
      colors: {
        "banks-darkblue": "#0A2342",
        "banks-lightblue": "#007BFF",
        "banks-accent": "#0056b3",
      },
      // Add fontFamily definition
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Set Inter as the default sans-serif
        serif: ['var(--font-newsreader)', 'serif'], // Add Newsreader as the serif option
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

