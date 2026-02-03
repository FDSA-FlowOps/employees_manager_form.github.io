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
        primary: {
          DEFAULT: "#d6007f",
          light: "#ff3399",
          dark: "#b3006b",
        },
        secondary: {
          DEFAULT: "#2b1f60",
          light: "#3d2a8a",
          dark: "#1f1645",
        },
      },
    },
  },
  plugins: [],
};
export default config;

