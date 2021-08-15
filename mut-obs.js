var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MutObs_observer;
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
        _MutObs_observer.set(this, void 0);
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
        __classPrivateFieldSet(this, _MutObs_observer, new MutationObserver((mutRecords) => {
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
        }), "f");
        __classPrivateFieldGet(this, _MutObs_observer, "f").observe(elToObserve, config);
        this.dispatchEvent(new CustomEvent('watching-for-' + g('dispatch'), {
            bubbles: h('bubbles'),
            composed: h('composed'),
            cancelable: h('cancelable')
        }));
    }
    disconnectedCallback() {
        var _a;
        (_a = __classPrivateFieldGet(this, _MutObs_observer, "f")) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
}
_MutObs_observer = new WeakMap();
const is = 'mut-obs';
if (!customElements.get(is))
    customElements.define(is, MutObs);
