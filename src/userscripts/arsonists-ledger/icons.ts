const S =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const BLANK = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>';
const CIRCLE = '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/>';

export const ICON_INFO = `<svg ${S}>${BLANK}${CIRCLE}<path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>`;

export const ICON_CHECK = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`;

export const ICON_X = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}${CIRCLE}<path d="M10 10l4 4m0 -4l-4 4"/></svg>`;

export const ICON_ARROW_RIGHT = `<svg ${S} width="12" height="12" style="vertical-align:middle;margin:0 2px">${BLANK}<path d="M5 12l14 0"/><path d="M15 16l4 -4"/><path d="M15 8l4 4"/></svg>`;

export const ICON_FLAME = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>`;

export const ICON_EXTERNAL_LINK = `<svg ${S}>${BLANK}<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></svg>`;

export const ICON_FLAMABILITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M500.5 320.5L499.8 318.6C465.8 224.8 410 140.5 337.1 72.5L333.8 69.5C330.1 66 325.1 64 320 64C314.9 64 309.9 66 306.2 69.5L302.9 72.5C230 140.5 174.2 224.8 140.2 318.6L139.5 320.5C131.9 341.3 128 363.4 128 385.6C128 490.7 214.8 576 320 576C425.2 576 512 490.7 512 385.6C512 363.4 508.1 341.4 500.5 320.5zM409.7 370C413.8 379.3 415.9 389.4 415.9 399.5C415.9 452.5 372.9 496 319.9 496C266.9 496 223.9 452.5 223.9 399.5C223.9 389.4 226 379.2 230.1 370L232 365.7C247.8 330.3 269.9 298 297.3 270.6L306.2 261.7C309.8 258.1 314.7 256.1 319.8 256.1C324.9 256.1 329.8 258.1 333.4 261.7L342.3 270.6C369.7 298 391.9 330.3 407.6 365.7L409.5 370z"/></svg>`;

export const ICON_TIMER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M320 64C302.3 64 288 78.3 288 96L288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160L352 130.7C442.8 145.9 512 224.9 512 320C512 426 426 512 320 512C214 512 128 426 128 320C128 266.3 150 217.7 185.6 182.9C198.2 170.5 198.4 150.3 186.1 137.6C173.8 124.9 153.5 124.8 140.8 137.1C93.5 183.6 64 248.4 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64zM257 223C247.6 213.6 232.4 213.6 223.1 223C213.8 232.4 213.7 247.6 223.1 256.9L303.1 336.9C312.5 346.3 327.7 346.3 337 336.9C346.3 327.5 346.4 312.3 337 303L257 223z"/></svg>`;

export const ICON_PIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>`;

export const ICON_SIREN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M69.3 100L117.3 132C128.3 139.4 131.3 154.3 124 165.3C116.7 176.3 101.7 179.3 90.7 172L42.7 140C31.7 132.6 28.7 117.7 36 106.7C43.3 95.7 58.3 92.7 69.3 100zM597.3 140L549.3 172C538.3 179.4 523.4 176.4 516 165.3C508.6 154.2 511.6 139.4 522.7 132L570.7 100C581.7 92.6 596.6 95.6 604 106.7C611.4 117.8 608.4 132.6 597.3 140zM24 256L88 256C101.3 256 112 266.7 112 280C112 293.3 101.3 304 88 304L24 304C10.7 304 0 293.3 0 280C0 266.7 10.7 256 24 256zM552 256L616 256C629.3 256 640 266.7 640 280C640 293.3 629.3 304 616 304L552 304C538.7 304 528 293.3 528 280C528 266.7 538.7 256 552 256zM144 368L169.4 152.5C173.1 120.3 200.5 96 232.9 96L407.1 96C439.6 96 466.9 120.3 470.7 152.5L496 368L258.3 368L271.9 218.2C273.1 205 263.4 193.3 250.2 192.1C237 190.9 225.3 200.6 224.1 213.8L210.1 368L144 368zM96 448C96 430.3 110.3 416 128 416L512 416C529.7 416 544 430.3 544 448L544 512C544 529.7 529.7 544 512 544L128 544C110.3 544 96 529.7 96 512L96 448z"/></svg>`;

export const ICON_MAGNIFYING_GLASS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>`;

export const ICON_EMBER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M281.6 93.9L297.6 72.6C301.6 67.2 308 64 314.7 64C326.4 64 336 73.6 336 85.3L336 107.4C336 120.5 341.4 133.1 350.9 142.1L435.6 223C484.4 269.6 512 334.2 512 401.7C512 498 434 576 337.7 576L320 576C214 576 128 490 128 384L128 380.2C128 331.4 147.4 284.6 181.9 250.1L185.4 246.6C189.6 242.4 195.4 240 201.4 240C213.9 240 224 250.1 224 262.6L224 352C224 387.3 252.7 416 288 416C323.3 416 352 387.3 352 352L352 348.1C352 330.1 344.8 312.8 332.1 300.1L293.5 261.5C269.5 237.5 256 204.8 256 170.8C256 143.1 265 116 281.6 93.9z"/></svg>`;

export const ICON_PLUS = `<svg ${S} width="12" height="12" style="vertical-align:middle">${BLANK}<path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg>`;

export const ICON_MATCHSTICK = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21l14 -9" /><path d="M16 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M17 3l3.62 7.29a4.007 4.007 0 0 1 -.764 4.51a4 4 0 0 1 -6.493 -4.464l3.637 -7.336" /></svg>`;

export const ICON_TRASH = `<svg ${S} width="12" height="12" style="vertical-align:middle">${BLANK}<path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/></svg>`;

export const ICON_SEND = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11"/><path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"/></svg>`;

export const ICON_CHEVRON_DOWN = `<svg ${S} width="16" height="16" aria-hidden="true">${BLANK}<path d="M6 9l6 6l6 -6"/></svg>`;

export const ICON_RESET = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3.06 13a9 9 0 1 0 .49 -4.087" /><path d="M3 4.001v5h5" /><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>`;

export const ICON_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>`;
