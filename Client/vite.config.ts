import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader(
            "Cross-Origin-Opener-Policy",
            "same-origin-allow-popups"
          );
          res.setHeader("Access-Control-Allow-Origin", "https://hotelhunt.kerchakpetshop.com.ar");
          res.setHeader("Access-Control-Allow-Credentials", "true");
          next();
        });
      },
    },
    react(),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          } else if (id.includes("src")) {
            return "app";
          }
        },
      },
    },
  },
});
