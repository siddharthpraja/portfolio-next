import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0c",
        graphite: "#141416",
        bone: "#f2efe8",
        lime: "#c6ff3d",
        // theme-aware tokens (a project panel can switch to the "paper" theme)
        fg: "var(--fg)",
        muted: "var(--muted)",
        line: "var(--line)",
        surface: "var(--surface)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
