/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pop: ["var(--font-pop)"],
      },
      colors: {
        primary: "#2563eb",
        secondary: "rgb(219 234 254)",
        "color-primary": "#1e40af",

        "navy-blue": "#001f3f",
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
     
    },
  },

};
export default config;
