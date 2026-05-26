import { STRATEGIES } from '../../data/strategies.js';
import { CATALOG, CATALOG_UPDATED } from '../../data/catalog.js';

declare const unsafeWindow: typeof window | undefined;
const root = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window) as Record<string, unknown>;

if (!root['BalaclavaScenarios']) {
    root['BalaclavaScenarios'] = { STRATEGIES, CATALOG, CATALOG_UPDATED };
}
