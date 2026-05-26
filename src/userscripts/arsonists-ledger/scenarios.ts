import { SCENARIOS } from '../../data/scenarios.js';
import { CATALOG, CATALOG_UPDATED } from '../../data/catalog.js';

declare const unsafeWindow: typeof window | undefined;
const root = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window) as unknown as Record<string, unknown>;

if (!root['BalaclavaScenarios']) {
    root['BalaclavaScenarios'] = { SCENARIOS, CATALOG, CATALOG_UPDATED };
}
