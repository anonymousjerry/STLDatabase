import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-light-yellow':'#FED700',
        'custom-light-maincolor': "#4E4D8D",
        'custom-dark-maincolor': "#cfcaff",
        'custom-light-secondcolor': "#f3f4f6",
        'custom-dark-secondcolor': "#1f2937",
        'custom-light-titlecolor': "#0e162e",
        'custom-dark-titlecolor': "#e5e7eb",
        'custom-light-textcolor': '#505050',
        'custom-dark-textcolor': '#D1D5DB',
        'custom-light-containercolor': '#FFFFFF',
        'custom-dark-containercolor': '#111827',
      },
      keyframes: {
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.5s ease-in-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-in-out forwards',
      },
    },
  },  
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("daisyui")],
};
export default config;
