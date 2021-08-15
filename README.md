# mut-obs

<a href="https://nodei.co/npm/mut-obs/"><img src="https://nodei.co/npm/mut-obs.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/mut-obs@0.0.10">

mut-obs is a web component wrapper around the mutation observer

```html
<mut-obs -observe -attributes -attr-filter -child-list -subtree -on -dispatch -unmatch-dispatch -bubbles -composed -cancelable></mut-obs>
```

observe is a required css selector that "up searches" -- it searches for a css match on its previous siblings, then parent, then previous sibling parents, etc., stopping at shadowDOM boundary.  The mutation observer is applied to that element, based on "attributes", "attr-filter", "child-list", "subtree" attributes.

on is a required css selector.  The added or removed node is tested with this attribute using the matches() method. 

If the test fails, nothing happens (unless unmatch-dispatch is set).  If it passes...

"dispatch" is the name of the event to fire if the "on" test passes. 

For example:

```html
<my-element></my-element>
<mut-obs observe=* attributes on=* dispatch=my-element-mutates></mut-obs>
```

Event "my-element-mutates" will be fired when mutations occur.  

Another event, "watching-for-my-element-mutates" is fired the moment mutation observation begins.

[TODO] Find a way to consolidate multiple mut-obs's into one.



