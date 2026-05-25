# Strategy Dataset delivered via userscript @resource

The Pyromaniac's Ledger Strategy Dataset (~90% of the bundle by bytes) is served as a static JSON file from `balaclava.app` and declared in the userscript header via `@resource`. The userscript manager fetches and caches it locally at install/update time; at runtime it is read synchronously via `GM_getResourceText` — no network request, no async loading path, no server pressure during gameplay.

## Considered options

**Runtime fetch with GM_setValue cache** — fetch the JSON via `GM_xmlhttpRequest` on first load, cache with a TTL. Rejected because it introduces an async startup path (loading state, error handling, stale-cache invalidation) and hits the server on every user's first daily session. At Torn scale that could be thousands of requests per day for a static file that rarely changes.

**Bundle inline** — keep strategies compiled into the IIFE. Rejected because the dataset is 89% of the bundle; separating it makes the code bundle small and fast to update independently of data.

## Consequences

Strategy data updates are tied to script releases — pushing a new JSON file to `balaclava.app` does nothing for existing installs until the script version is bumped and the userscript manager re-fetches. This is acceptable because data corrections are infrequent and can be staged locally via Strategy Overrides (see `pyroLedger.v1.strategyOverrides`) before being published in the next release.
