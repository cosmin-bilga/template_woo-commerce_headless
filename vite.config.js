import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const prodEnv = loadEnv("production", process.cwd(), "VITE_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/woo-api": {
          target: prodEnv.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/woo-api/, ""),

          configure: (proxy, _options) => {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              const setCookie = proxyRes.headers["set-cookie"];
              if (setCookie) {
                proxyRes.headers["set-cookie"] = setCookie.map(
                  (cookie) =>
                    cookie
                      .replace(/Secure/gi, "") // Supprime l'obligation HTTPS
                      .replace(/SameSite=None/gi, "SameSite=Lax") // Aligne sur le comportement local
                      .replace(/domain=[^;]+/gi, "") // 🎯 FIX 1 : Supprime le domaine pour que localhost puisse l'adopter
                      .replace(/path=\/wooc\/?/gi, "path=/") // 🎯 FIX 2 : Gère le slash optionnel pour éviter le "path=//"
                      .replace(/;\s*;/g, ";"), // Nettoyage des points-virgules vides
                );
              }
            });
          },
        },
      },
    },
  };
});
