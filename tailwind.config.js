/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Include all HTML and TypeScript files
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors if needed
        primary: '#4b2e83', // Example primary color
        secondary: '#A69CAC', // Example secondary color
        // Add more colors as needed
      },
    },
  },
  plugins: [require('daisyui')],
  // Ensure dark mode is not enabled or override it
  darkMode: false, // Disable dark mode
}
