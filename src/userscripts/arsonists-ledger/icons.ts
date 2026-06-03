const S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const BLANK = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>';
const CIRCLE = '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/>';

export const ICON_INFO = `<svg ${S}>${BLANK}${CIRCLE}<path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>`;

export const ICON_CHECK = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`;

export const ICON_X = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}${CIRCLE}<path d="M10 10l4 4m0 -4l-4 4"/></svg>`;

export const ICON_ARROW_RIGHT = `<svg ${S} width="12" height="12" style="vertical-align:middle;margin:0 2px">${BLANK}<path d="M5 12l14 0"/><path d="M15 16l4 -4"/><path d="M15 8l4 4"/></svg>`;

export const ICON_FLAME = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>`;

export const ICON_EXTERNAL_LINK = `<svg ${S}>${BLANK}<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></svg>`;
