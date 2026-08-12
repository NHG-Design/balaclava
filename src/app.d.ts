import type { Fetcher } from '@cloudflare/workers-types'

declare global {
  namespace App {
    interface Platform {
      env: {
        TORN_PUBLIC_API_KEY: string
        TORN_MINIMAL_API_KEY: string
        TURSO_DATABASE_URL: string
        TURSO_AUTH_TOKEN: string
        PLAYER_SESSION_SECRET: string
        SCENARIO_ADMIN_USERNAME: string
        SCENARIO_ADMIN_PASSWORD_HASH: string
        SCENARIO_ADMIN_SESSION_SECRET: string
        GITHUB_PAT: string
        GITHUB_WEBHOOK_SECRET: string
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
