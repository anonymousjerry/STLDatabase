import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow':'#FED700',
        'custom-bgcolor': '#0E162E',
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
