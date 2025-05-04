import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server', // Enable server-side rendering
  adapter: vercel(), // Add Vercel adapter
  vite: {
    plugins: [tailwindcss()],
  },
});