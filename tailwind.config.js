/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "slow-gradient": "slowGradient 40s ease infinite",
        zebra: "zebraMove 30s linear infinite",
      },
      keyframes: {
        slowGradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        zebraMove: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "400% 400%" },
        },
      },
    },
  },
  plugins: [],
};
