Object.installProperty
======================

defineProperty, undoably.

https://github.com/dankogai/js-installproperty

SYNOPSIS
--------

One property by one…

````javascript
var o = Object.create(null), prev, descs;
Object.installProperty(o, "k", {value:1});      // true
Object.defineProperty(o, "ng", {value:'IGNOREME'}); // define an immutable property
Object.installProperty(o, "ng", {value:1});     // false because the target is immutable
Object.installProperty(o, "k", {value:2});      // true
console.log(o.k);                               // 2
prev = Object.revertProperty(o, "k")
console.log(prev);  // {value:2, configurable:true, writable:true, enumerable:false}
console.log(o.k);                               // 1
prev = Object.revertProperty(o, "k")   // undefined // undo buffer is empty
````

…or all at once!

````javascript
o = [0, 1]; // any object will do! (unless it is primitive, of course)
descs = {0:{value:1},1:{value:2}};
Object.installProperties(o, descs);
console.log(o[0], o[1]);    // 1, 2
Object.revertProperties(o, descs);
console.log(o[0], o[1]);    // 0, 1
````

If you don't like it, you can restore the original state spotlessly:
````javascript
Object.restoreProperties(o);
````

DESCRIPTION
-----------

`Object.defineProperty` is great except the fact it overwrites the previous 
property *unconditionally*.  Isn't it nice if you can undo the operation,
especially when you are tweaking built-in objects?  This `installproperty.js`
just does that!

On load, `installproperty.js` *installProperties* following functions
to `Object`.

### Object.installProperty( *obj* , *prop* , *desc* )

Same as `Object.defineProperty` except the previous descriptor can be
reverted.

+ If *prop* already exists but not `configurable:true` and
`writable:true`, it gives up and returns `false`
+ It forces *desc* to be `configurable:true` and `writable:true` so it
can be reverted.

Returns `true` on success, `false` otherwise.  And if it fails to
create "revert buffer", throws exception.

### Object.defaultProperty( *obj* , *prop* , *desc* )

Does `Object.installProperty()` iff *prop* is not in *obj*.
Otherwise it immediately returns `false`, leaving *obj* intact.

### Object.revertProperty( *obj* , *prop* )

Reverts the *prop* in *obj*.  It returns the current descriptor or
`undefined` if *prop* is not in *obj* or the revert buffer is empty.

### Object.installProperties( *obj* , *props* )

Same as `Object.defineProperties` except the previous descriptors can
be reverted.

### Object.defaultProperties( *obj* , *props* )

Does `Object.installProperty()` only for each nonexistent properties.
Very handly if you want to extend non-owner objects like built-ins.
This is the function used by installproperty.js to install all these
functions.

### Object.revertProperties( *obj* *[, props ]* )

Reverts properties at once.  *props* is an object that tells whose
keys address what properties to revert.  If *prop* is ommitted, all
properties in the "revert buffer" are reverted.

Returns an object with pairs of reverted property names and the
corresponding descriptors.  That way you can go like:

````javascript
descs = Object.revertProperties(obj);
// ... later ...
Object.installProperties(obj, descs); // redo!
````

### Object.restoreProperties( *obj* )

Spotlessly restores *obj*.  All properties are restored back to its
initial state (the state before the first invocation of
Object.installPropert(y|ies) ) and its "revert buffer" is removed.

Yes, you can restore `Object` itself via `Object.restoreProperties(Object)`!
