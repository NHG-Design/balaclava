import { CATALOG, type ResourceId } from '../../data/catalog.js';
import { type PriceMap } from './engine.js';

const TORN_ITEMS_URL = 'https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=';

const tornIdToResource: Map<number, ResourceId> = new Map(
    Object.values(CATALOG)
        .filter(r => r.tornId !== undefined)
        .map(r => [r.tornId!, r.id as ResourceId])
);

export interface ApiFetchResult {
    success: boolean;
    prices?: PriceMap;
    updatedCount?: number;
    error?: string;
}

export async function fetchApiPrices(apiKey: string): Promise<ApiFetchResult> {
    try {
        const response = await fetch(TORN_ITEMS_URL + encodeURIComponent(apiKey));
        if (!response.ok) return { success: false, error: `HTTP ${response.status}` };

        const data = await response.json() as {
            items?: Array<{ id: number; value?: { market_price?: number } }>;
            error?: { error: string };
        };

        if (data.error) return { success: false, error: data.error.error };
        if (!Array.isArray(data.items)) return { success: false, error: 'Unexpected response format' };

        const prices: PriceMap = {};
        for (const item of data.items) {
            const resourceId = tornIdToResource.get(item.id);
            if (resourceId && item.value?.market_price && item.value.market_price > 0) {
                prices[resourceId] = item.value.market_price;
            }
        }

        return { success: true, prices, updatedCount: Object.keys(prices).length };
    } catch {
        return { success: false, error: 'Network error' };
    }
}
