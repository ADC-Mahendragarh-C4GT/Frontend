import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: "autoUpdate", // automatically updates the service worker
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"], 
      manifest: {
        name: "Suvidha Manch",
        short_name: "Suvidha",
        description: "A Web App for road taxonomy and infrastructure tracking, enabling users to view, monitor, and manage municipal roads efficiently. Access it anytime, anywhere, even offline, and get a fast, app-like experience on mobile and desktop.",
        theme_color: "#1976d2",
        background_color: "#ffffff",
        display: "standalone", // makes it look like an app
        icons: [
          {
            src: "./images/HaryanaGovWhiteBackground.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./images/HaryanaGovWhiteBackground.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
],
})
