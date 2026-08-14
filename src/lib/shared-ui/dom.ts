export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
}

export function txt(content: string): Text {
    return document.createTextNode(content);
}

export function svgEl(html: string): SVGSVGElement {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.firstElementChild as SVGSVGElement;
}

export function injectStyleOnce(id: string, css: string): void {
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
}
