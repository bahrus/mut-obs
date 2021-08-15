var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _observer;
export function upSearch(el, css) {
    if (css === 'parentElement')
        return el.parentElement;
    let upEl = el.previousElementSibling || el.parentElement;
    while (upEl && !upEl.matches(css)) {
        upEl = upEl.previousElementSibling || upEl.parentElement;
    }
    return upEl;
}
export class MutObs extends HTMLElement {
    constructor() {
        super(...arguments);
        _observer.set(this, void 0);
    }
    connectedCallback() {
        this.style.display = 'none';
        const g = this.getAttribute.bind(this);
        const h = this.hasAttribute.bind(this);
        const elToObserve = upSearch(this, g('observe'));
        if (elToObserve === null)
            return;
        const config = {
            attributeFilter: g('attribute-filter') !== null ? JSON.parse(g('attribute-filter')) : undefined,
            attributes: h('attributes'),
            childList: h('child-list'),
            subtree: h('subtree'),
            attributeOldValue: h('attribute-old-value'),
            characterData: h('character-data'),
            characterDataOldValue: h('character-data-old-value')
        };
        const bubbles = h('bubbles');
        const composed = h('composed');
        const cancelable = h('cancelable');
        const unmatchDispatch = g('unmatch-dispatch');
        const on = g('on');
        const dispatch = g('dispatch');
        __classPrivateFieldSet(this, _observer, new MutationObserver((mutRecords) => {
            for (const mutRecord of mutRecords) {
                switch (mutRecord.type) {
                    case 'characterData':
                    case 'attributes':
                        const matches = elToObserve.matches(on);
                        if (matches) {
                            this.dispatchEvent(new CustomEvent(dispatch, {
                                bubbles,
                                composed,
                                cancelable,
                                detail: {
                                    match: elToObserve
                                }
                            }));
                        }
                        else if (unmatchDispatch !== null) {
                            this.dispatchEvent(new CustomEvent(unmatchDispatch, {
                                bubbles,
                                composed,
                                cancelable,
                                detail: {
                                    unmatch: elToObserve
                                }
                            }));
                        }
                        break;
                    case 'childList':
                        mutRecord.addedNodes.forEach(node => {
                            if (node instanceof HTMLElement) {
                                const matches = node.matches(on);
                                if (matches) {
                                    this.dispatchEvent(new CustomEvent(dispatch, {
                                        bubbles,
                                        composed,
                                        cancelable,
                                        detail: {
                                            match: node
                                        }
                                    }));
                                }
                            }
                            else if (unmatchDispatch !== null) {
                                this.dispatchEvent(new CustomEvent(unmatchDispatch, {
                                    bubbles,
                                    composed,
                                    cancelable,
                                    detail: {
                                        unmatch: elToObserve
                                    }
                                }));
                            }
                        });
                        break;
                }
                //console.log(mutRecord);
                //mutRecord.addedNodes
            }
        }));
        __classPrivateFieldGet(this, _observer).observe(elToObserve, config);
        this.dispatchEvent(new CustomEvent('watching-for-' + g('dispatch'), {
            bubbles: h('bubbles'),
            composed: h('composed'),
            cancelable: h('cancelable')
        }));
    }
    disconnectedCallback() {
        var _a;
        (_a = __classPrivateFieldGet(this, _observer)) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
}
_observer = new WeakMap();
const is = 'mut-obs';
if (!customElements.get(is))
    customElements.define(is, MutObs);
