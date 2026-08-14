import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  ssr: {
    // Keep workers-og as a bare import in the SSR output so wrangler's
    // esbuild (not Vite's Node.js module runner) handles its WASM imports.
    external: ['workers-og'],
  },
})
