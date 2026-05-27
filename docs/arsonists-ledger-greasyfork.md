**Arsonist's Ledger** overlays profit-per-nerve rankings directly on Torn's Crimes page for every arson scenario, so you can see at a glance which fires are worth your nerve and which aren't.

## What it does

- **Colour-codes every arson card** with a left-edge band: red (negative), yellow (low), green (good), or teal (excellent), based on your configurable profit-per-nerve thresholds
- **Hover tooltip** shows the full breakdown: material cost, nerve cost, and profit-per-nerve for the scenario
- **Scenario guide** — tap the info badge on any card to see recommended actions, required materials, and tips
- **Live price tracking** — connect your Torn API key to pull current market prices automatically (refreshed every 24 hours), or enter prices manually per item
- **Adjustable thresholds** — set your own low/good/excellent cutoffs to match your playstyle

## Setup

1. Install the script
2. Open Torn → Crimes → Arson
3. Click the ⚙️ settings button injected into the page
4. (Optional) Paste a Torn API key to enable automatic price fetching

No configuration is required to get started — the script ships with default prices and works immediately.

## Permissions

- `GM_getValue` / `GM_setValue` — stores your prices, API key, and thresholds locally
- `GM_xmlhttpRequest` — fetches market prices from the Torn API and scenario data from balaclava.app
- `unsafeWindow` — needed to register the shared tooltip component
