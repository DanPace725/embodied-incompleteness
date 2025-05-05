import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server', // Enable server-side rendering
  adapter: vercel(), // Add Vercel adapter
  integrations: [
    react(), // Add React integration
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});