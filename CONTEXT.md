# Balaclava

## Overview

Balaclava (`balaclava.app`) is a platform of Torn tools built by a player, for players. Operated by Yukio, it is publicly accessible and community-focused — serving live-updating image signatures, Tampermonkey userscripts, and Torn-related web apps. Access to certain features (faction signatures) is gated by a whitelist controlled solely by Yukio.

## Language

- **Torn**: A browser-based, text-driven massively multiplayer crime RPG. The external game this platform serves.
- **Player**: A registered Torn user. Has a numeric ID, name, level, rank, status, faction membership, and Personal Stats. _Avoid_: "user" (overloaded with app-layer meaning)
- **Faction**: A group of Players in Torn with a numeric ID, name, tag, and ranked war record. _Avoid_: "team", "guild", "clan"
- **Member**: A Player who belongs to a Faction. Has a position, `days_in_faction`, last action, and status. _Avoid_: "faction user", "faction player"
- **Personal Stats**: Lifetime numeric counters tracked per Player by Torn (attacks won, times traveled, drugs taken, etc.). Fetched from the Torn API. _Avoid_: "stats", "player stats" (too broad)
- **Derived Stat**: A stat computed from one or more raw Personal Stats fields within balaclava (e.g. KDA, hit rate, cost per rehab). Not available directly from the Torn API. _Avoid_: "calculated stat", "custom stat"
- **Signature** (Sig): A 600×100 px dynamically generated PNG served by balaclava as a live-updating player badge. Embedded in Torn forum posts and player profile pages. Also called "banner" interchangeably. _Avoid_: "image", "card"
- **Personal Signature**: A Signature hardcoded to a specific Player. Exists only for Yukio and LeLeMiC. Not self-service. _Avoid_: "user signature", "player banner"
- **Faction Signature**: A configurable Signature for a Member of a Whitelisted Faction. Parameters (stats, alignment, logo) are set via the Faction Builder. Displays last action status intentionally — this is public data and a deliberate design choice. _Avoid_: "faction image"
- **Faction Builder**: The self-service UI at `/faction` where a Member enters their Faction ID and Player ID, configures display options, and receives a shareable Faction Signature URL.
- **Whitelisted Faction**: A Faction whose numeric ID has been explicitly added to the allowlist in `src/lib/factions.tsx` by Yukio. Only Members of Whitelisted Factions can generate Faction Signatures. Yukio is the sole controller.
- **Company**: A player-owned business in Torn with a numeric ID and a roster of Employees. _Avoid_: "guild", "org"
- **Employee**: A Player who works at a Company. Has a position, effectiveness score, `days_in_company`, wage, and last action.
- **Company Signature**: A Signature for an Employee, showing effectiveness, position, days in company, and last action. Requires a Limited API key provided by the Company owner. Currently scoped to a single company (Yukio's former company) — not a general multi-company service. _Avoid_: "company image"
- **Userscript**: A JavaScript file installed via Tampermonkey that modifies the Torn game UI in the browser. Balaclava hosts and distributes userscripts with landing pages, install links, and changelogs. The first userscript targets the Arson crime workflow.
- **Torn API**: The official HTTP API for Torn. Used by balaclava at request time — there is no local database. All data is fetched live.

### Arson Crime Domain

- **Arson Crime**: A time-gated daily crime activity in Torn. Players receive a shared batch of Jobs at 00:00 TCT each day. The subject of the first balaclava userscript.
- **Job** (Arson): A single arson assignment with a location, requirements, and destruction target. Not to be confused with a Torn player's employment Job. _Avoid_: "task", "mission"
- **Nerve**: The resource spent on Arson actions (Breach costs 3, most actions cost 5, Collect costs 2). Shared across all Torn activities.
- **Crime Skill (CS)**: A player stat that governs which Arson jobs are visible, unlocks new accelerants and tools, and reduces critical failure rates.
- **Accelerant**: A material placed or stoked during Arson. Divided into liquids (Gasoline, Diesel, Kerosene), solids (Magnesium, Thermite, Saltpetre), and gases (Oxygen, Methane, Hydrogen). Each has different intensity, momentum, spread, and suspicion effects.
- **Intensity**: How fiercely the fire burns. Drives destruction rate. Decays at 0.2/sec when Momentum is zero; spikes to 1.0/sec decay after First Responders arrive.
- **Momentum**: Unburned fuel pooling on the property. Consumed by flammability rate; only increases when stoking. High momentum risks accidents.
- **Suspicion**: How obvious the arson is. All accelerants raise it except Methane (which lowers it). Exceeding the limit fails Insurance Claim jobs.
- **Visibility**: How quickly the public reports the blaze. Only Diesel, Magnesium, and the Flamethrower raise it; it cannot be lowered once raised.
- **Flammability**: A location property (1–5×) governing how fast intensity and momentum scale and the max destruction rate.
- **Rurality**: A location property (1–5) governing First Responder response time (30s–480s).
- **Area**: A spatial subdivision of a job location. Large properties have multiple areas each tracking intensity, momentum, and destruction independently.
- **First Responders**: The time limit mechanic. Dispatched based on rurality and visibility; arrival freezes all actions and accelerates intensity decay.
- **Destruction**: The primary output metric of an Arson job, expressed as a percentage (0–100%). Scales payout linearly unless a damage-cap requirement applies.
- **TCT**: Torn City Time — the game's timezone (UTC+0). All daily resets occur at 00:00 TCT.

### Userscript Infrastructure

- **BalaclavaTooltip**: A foundational Tampermonkey userscript library (`balaclava-tooltip.user.js`) providing a universal, viewport-aware tooltip system via Shadow DOM. Distributed as a `@require` dependency for other balaclava userscripts. Exposes `unsafeWindow.BalaclavaTooltip` with `.show()`, `.hide()`, `.configure()`, `.attach()`, and `.rescan()`.
- **Consumer Script**: A balaclava userscript that depends on BalaclavaTooltip via `@require`. Accesses the tooltip API through `unsafeWindow.BalaclavaTooltip`.

### Torn API Key Tiers

| Tier | Access scope | Used by |
|------|-------------|---------|
| Public | Only data already visible to any player | Personal Signatures, Faction Signatures (user personalstats) |
| Minimal | Non-private data; cannot harm the key owner | Faction Signatures (faction basic data) |
| Limited | All data except account log (includes battle stats, financials) | Company Signatures (company employee data) |
| Full | Everything, including full account history | Not used |

Company Signatures require a Limited key provided by the company owner. Faction Signatures run on Yukio's own Public/Minimal keys (or a faction leader's — TBD). Full keys are never used.

### Relationships

- A Faction has many Members; a Member belongs to exactly one Faction
- A Company has many Employees; an Employee belongs to exactly one Company
- A Faction Signature is generated for one Member of one Whitelisted Faction
- A Company Signature is generated for one Employee of one Company, using the Company owner's Limited key
- Personal Stats are per Player; Derived Stats are computed from Personal Stats by balaclava
- A Whitelisted Faction is a Faction whose ID appears in `src/lib/factions.tsx`

## Architecture

All Signature endpoints are edge-runtime functions that fetch live Torn API data and return a PNG via `@vercel/og` (`ImageResponse`). There is no database — every request hits the Torn API. The Faction Builder is a client-side form that constructs a Faction Signature URL; the URL itself is the output. The Torn API integration uses two environment-variable keys (`NEXT_PUBLIC_TORN_PUBLIC_API_KEY`, `NEXT_PUBLIC_TORN_MINIMAL_API_KEY`).

## Directory Structure

| Path | Purpose |
|------|---------|
| `src/pages/api/faction/` | Faction Signature endpoint (`[id].tsx`) and raw member data endpoint (`all.tsx`) |
| `src/pages/api/sigs/` | Personal Signature endpoints — one file per named player |
| `src/pages/` | UI pages: `faction.tsx` (Faction Builder), `index.tsx` (catch-all redirect) |
| `src/lib/` | Torn API wrappers, stat registry, faction whitelist |
| `src/common/types.ts` | Shared TypeScript interfaces mirroring Torn API response shapes |
| `src/ui/` | Balaclava-specific UI components (banner sub-elements, combobox, icons) |
| `src/components/` | Generic reusable UI primitives (input, buttons, shadcn wrappers) |
| `public/factions/[id]/` | Static faction-specific assets: `banner.png`, `logo.svg` |
| `app.config.mjs` | App-level constants: canonical URL, title, contact person |
| `docs/` | PRDs and reference guides for features under development |

## Key Patterns

- **Stat registry**: All Personal Stats are defined in `src/lib/personal-stats.tsx`. Derived Stats are defined in the `specialStats` export of the same file with a `calculate` function. Adding any stat requires editing this file.
- **Whitelist check**: `whitelisted.getAll` in `src/lib/factions.tsx` is an array of faction ID strings. Adding a Whitelisted Faction is a code change, not a config or DB operation.
- **Faction Signature URL**: Built client-side in `src/pages/faction.tsx`. The URL encodes all display options as query params (`stats`, `align`, `rounded`, `factionLogo`, `daysInFaction`).
- **Edge runtime**: All image endpoints export `export const config = { runtime: "edge" }`. Node.js-only APIs cannot be used in these files.
- **Fallback assets**: `getFactionBanner` and `getFactionLogo` in `src/lib/factions.tsx` fall back to generic assets (`/banners/1.png`, `/logos/1.png`) if the faction is not whitelisted or the asset is missing.

## Known Gaps

- The whitelist is hardcoded — there is no admin UI or database-backed management.
- `@vercel/og` is Vercel-specific; the platform is migrating to Cloudflare Workers (required for live-updating image endpoints). The image generation layer will need to be replaced — `@vercel/og` uses `satori` + `resvg` under the hood; the Cloudflare equivalent is `@cloudflare/workers-og` or those primitives directly.
- The tRPC router (`src/server/trpc/`) exists from T3 scaffolding but is not actively used by any feature.
- The codebase will be rewritten in SvelteKit; Next.js-specific patterns should not be extended.
