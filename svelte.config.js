import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // CSP must be configured here, not as a manual header in hooks.server.ts — SvelteKit
    // emits inline <script> blocks for the hydration payload and only nonces them when it
    // owns the policy. A hand-set `default-src 'self'` blocks those scripts and the app
    // never hydrates.
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'img-src': ['self', 'data:', 'https:'],
        'style-src': ['self', 'unsafe-inline'],
        'frame-ancestors': ['none'],
        'base-uri': ['self']
      }
    }
  }
}

export default config
