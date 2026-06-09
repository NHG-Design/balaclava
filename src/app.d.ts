import type { D1Database, Fetcher } from '@cloudflare/workers-types'

declare global {
  namespace App {
    interface Platform {
      env: {
        SCENARIO_ADMIN_PASSWORD_HASH: string
        SCENARIO_ADMIN_SESSION_SECRET: string
        SCENARIO_ADMIN_USERNAME: string
        SCENARIO_PROPOSALS_DB: D1Database
        TORN_PUBLIC_API_KEY: string
        TORN_MINIMAL_API_KEY: string
        ASSETS: Fetcher
      }
      context: {
        waitUntil(promise: Promise<unknown>): void
      }
      caches: CacheStorage & { default: Cache }
    }
    interface Locals {
      scenarioAdminUsername: string | null
    }
  }
}

export {}
