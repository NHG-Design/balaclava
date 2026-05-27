const S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const BLANK = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>';
const CIRCLE = '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/>';

export const ICON_INFO = `<svg ${S}>${BLANK}${CIRCLE}<path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>`;

export const ICON_CHECK = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`;

export const ICON_X = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}${CIRCLE}<path d="M10 10l4 4m0 -4l-4 4"/></svg>`;

export const ICON_ARROW_RIGHT = `<svg ${S} width="12" height="12" style="vertical-align:middle;margin:0 2px">${BLANK}<path d="M5 12l14 0"/><path d="M15 16l4 -4"/><path d="M15 8l4 4"/></svg>`;

export const ICON_GEAR = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;

export const ICON_EXTERNAL_LINK = `<svg ${S}>${BLANK}<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></svg>`;
