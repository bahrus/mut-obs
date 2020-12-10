# mut-obs

mut-obs is a web component wrapper around the mutation observer

```html
<mut-obs -observe -attributes -attr-filter -child-list -subtree -on -dispatch -bubbles -composed></mut-obs>
```

observe is a required css selector that "up searches" -- it searches / matches previous siblings, then parent, then previous sibling parents, etc., stopping at shadowDOM boundary.

on is a required css selector.  The added or removed node is tested with this attribute using the matches() method. 

If the test fails, nothing happens.  If it passes...

"dispatch" is the required name of the event to fire if the "on" test passes. An "is-active" event is also fired, where is-active is append to the dispatch name.

For example:

```html
<my-element></my-element>
<mut-obs observe=* attributes on=* dispatch=my-element-mutates></mut-obs>
```

Event "my-element-mutates" will be fired when mutations occur.  

Another event, "watching-for-my-element-mutates" is fired the moment mutation observation begins.


