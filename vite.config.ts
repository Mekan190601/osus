import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [],

      manifest: {
        name: "ÖSÜŞ",
        short_name: "ÖSÜŞ",

        description: "Şahsy ösüş dolandyryş ulgamy",

        theme_color: "#0b1f27",
        background_color: "#0b1f27",
        icons: [
  {
    src: "/pwa-192x192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/pwa-512x512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/pwa-512x512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
],

        display: "standalone",
        start_url: "/",
        scope: "/",

        lang: "tk",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webp}"],

        navigateFallback: "/index.html",

        cleanupOutdatedCaches: true,

        clientsClaim: true,
        skipWaiting: true,
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
});