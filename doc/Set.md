Set
===

From ES6:
---------

+ Set()
 + Set.prototype.add( *value* )
 + Set.prototype.has( *value* )
 + Set.prototype.delete( *value* )
 + Set.prototype.values()
 + Set.prototype.clear()

When polyfilled by es2pi, Set is implemented as a child prototype of `Map`
which happens to have access to its keys only.

On es2pi:
---------

None so far.

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets
