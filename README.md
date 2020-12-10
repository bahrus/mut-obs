# mut-obs

mut-obs is a web component wrapper around the mutation observer

```html
<mut-obs -observe -attributes -attribute-filter -child-list -sub-tree -css-filter-test id></mut-obs>
```

observe is a css selector that searches previous siblings, then parent, then previous sibling parents, etc., stopping at shadowDOM boundary.

mut-obs fires bubbling event that is driven by the id.

For example:

```html
<mut-obs id=myObserver></mut-obs>
```

event "mutation-observed-by-myObserver" will be fired when mutations occur.  

Another event, "mutation-observer-myObserver-is-active" is fired the moment observation begins.


