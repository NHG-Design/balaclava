import type { Fetcher } from '@cloudflare/workers-types'

declare global {
  namespace App {
    interface Platform {
      env: {
        TORN_API_KEY: string
        ASSETS: Fetcher
      }
      context: {
        waitUntil(promise: Promise<unknown>): void
      }
      caches: CacheStorage & { default: Cache }
    }
  }
}

export {}
