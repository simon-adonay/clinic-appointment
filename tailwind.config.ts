import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        clinic: {
          50: "#eefcf8",
          100: "#d6f7ef",
          500: "#12a88a",
          600: "#0d8d76",
          700: "#0b715f"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(24, 33, 47, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
