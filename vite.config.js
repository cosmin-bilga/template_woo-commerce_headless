import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const prodEnv = loadEnv("production", process.cwd(), "VITE_");
  return {
    plugins: [react()],
    //base: "/",
    server: {
      proxy: {
        "/woo-api": {
          target: prodEnv.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/woo-api/, ""),
        },
      },
    },
  };
});
