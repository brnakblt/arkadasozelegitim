/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.staticwebsite.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7CB342",
        secondary: "#F4A261",
        accent: "#A5D6A7",
        "neutral-dark": "#2A2A2A",
        "neutral-light": "#F8F9FA",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(124, 179, 66, 0.1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out",
        "fade-out": "fade-out 0.8s ease-out",
      },
    },
  },
  plugins: [],
};
