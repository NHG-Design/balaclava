import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    // Keep workers-og as a bare import in the SSR output so wrangler's
    // esbuild (not Vite's Node.js module runner) handles its WASM imports.
    external: ['workers-og'],
  },
})
