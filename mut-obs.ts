export function upSearch(el: Element, css: string){
    if(css === 'parentElement') return el.parentElement;
    let upEl = el.previousElementSibling || el.parentElement;
    while(upEl && !upEl.matches(css)){
        upEl = el.previousElementSibling || el.parentElement;
    }
    return upEl;
}

export class MutObs extends HTMLElement{
    #observer: MutationObserver | undefined;
    connectedCallback(){
        this.style.display = 'none';
        const g = this.getAttribute.bind(this);
        const h = this.hasAttribute.bind(this);
        const elToObserve = upSearch(this, g('observe') as string);
        if(elToObserve === null) return;
        const config : MutationObserverInit = {
            attributeFilter: g('attribute-filter') !== null ? JSON.parse(g('attribute-filter') as string) : undefined,
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
        const on = g('on') as string;
        const dispatch = g('dispatch') as string;
        this.#observer = new MutationObserver((mutRecords: MutationRecord[]) => {
            for(const mutRecord of mutRecords){
                switch(mutRecord.type){
                    case 'characterData':
                    case 'attributes':
                        const matches = elToObserve.matches(on);
                        if(matches){
                            this.dispatchEvent(new CustomEvent(dispatch, {
                                bubbles,
                                composed,
                                cancelable,
                                detail: {
                                    match: elToObserve
                                }
                            }));
                        }else if(unmatchDispatch !== null){
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
                            if(node instanceof HTMLElement){
                                const matches = node.matches(on);
                                this.dispatchEvent(new CustomEvent(dispatch, {
                                    bubbles,
                                    composed,
                                    cancelable,
                                    detail: {
                                        match: elToObserve
                                    }
                                }));
                            }else if(unmatchDispatch !== null){
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

        });
        this.#observer.observe(elToObserve as Element, config);
        this.dispatchEvent(new CustomEvent('watching-for-' + g('dispatch'), {
            bubbles: h('bubbles'),
            composed: h('composed'),
            cancelable: h('cancelable')
        }));
    }
    disconnectedCallback(){
        this.#observer?.disconnect();
    }
}
const is = 'mut-obs';
if(!customElements.get(is)) customElements.define(is, MutObs);