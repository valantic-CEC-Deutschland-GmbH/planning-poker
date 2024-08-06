import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        valanticLight: {
          "primary": "#FF4B4B",
          "secondary": "#FF744F",
          "accent": "#F99E49",
          "neutral": "#1A2025",
          "base-100": "#ffffff",
          "info": "#38bdf8",
          "success": "#a3e635",
          "warning": "#f97316",
          "error": "#f43f5e",
        },
        valanticDark: {
          "primary": "#FF4B4B",
          "secondary": "#FF744F",
          "accent": "#F99E49",
          "neutral": "#ffffff",
          "base-100": "#1A2025",
          "info": "#38bdf8",
          "success": "#a3e635",
          "warning": "#f97316",
          "error": "#f43f5e",
        },
      },
    ],
  },
};
export default config;
