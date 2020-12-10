export function upSearch(el, css) {
    let upEl = el.previousElementSibling || el.parentElement;
    while (upEl && !upEl.matches(css)) {
        upEl = el.previousElementSibling || el.parentElement;
    }
    return upEl;
}
export class MutObs extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
        const g = this.getAttribute.bind(this);
        const h = this.hasAttribute.bind(this);
        const elToObserve = upSearch(this, g('observe'));
        const config = {
            attributeFilter: g('attr-filter') !== null ? JSON.parse(g('attr-filter')) : undefined,
            attributes: h('attributes'),
            childList: h('child-list'),
            subtree: h('subtree'),
            attributeOldValue: h('attribute-old-value'),
            characterData: h('character-data'),
            characterDataOldValue: h('character-data-old-value')
        };
        this._observer = new MutationObserver((mutRec) => {
            if (elToObserve?.matches(g('on'))) {
                this.dispatchEvent(new CustomEvent(g('dispatch'), {
                    bubbles: h('bubbles'),
                    composed: h('composed'),
                    cancelable: h('cancelable'),
                    detail: {
                        mutRec
                    }
                }));
            }
        });
        this._observer.observe(elToObserve, config);
        this.dispatchEvent(new CustomEvent('watching-for-' + g('dispatch'), {
            bubbles: h('bubbles'),
            composed: h('composed'),
            cancelable: h('cancelable')
        }));
    }
    disconnectedCallback() {
        this._observer?.disconnect();
    }
}
const is = 'mut-obs';
if (!customElements.get(is))
    customElements.define(is, MutObs);
