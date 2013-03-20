Object
======

From ES6:
---------

+ Object.is( *objx*, *objy* )
+ Object.isnt( *objx*, *objy* )

On es2pi:
--------

### Deep Comparison and Cloning

See [Object.clone] for details.

+ Object.equals( *objx*, *objy* *[, check]* )
+ Object.clone( *src*, *[isdeep, check]* )

[Object.clone]: Object.clone.md

### Property Management

+ Object.extend( *dst*, *src* )
+ Object.defaults( *dst*, *src* )

### Type Checking

+ Object.typeOf( *unknown* )
+ Object.classOf( *unknown* )
+ Object.isArray( *unknown* )
+ Object.isBoolean( *unknown* )
+ Object.isFunction( *unknown* )
+ Object.isNil( *unknown* )
+ Object.isNull( *unknown* )
+ Object.isNumber( *unknown* )
+ Object.isObject( *unknown* )
+ Object.isPrimitive( *unknown* )
+ Object.isString( *unknown* )
+ Object.isUndefined( *unknown* )

#### Prototypal Versions

+ Object.prototype.tyepeOf()
+ Object.prototype.classOf()
+ Object.prototype.isArray()
+ Object.prototype.isBoolean()
+ Object.prototype.isFunction()
+ Object.prototype.isNil()
+ Object.prototype.isNull()
+ Object.prototype.isNumber()
+ Object.prototype.isObject()
+ Object.prototype.isPrimitive()
+ Object.prototype.isString()
+ Object.prototype.isUndefined()

### Object as a Collection

They DO NOT have prototypal versions to prevent `Object.prototype`
from congesting.

+ Object.has( *obj*, *prop* )
+ Object.get( *obj*, *prop* )
+ Object.set( *obj*, *prop*, *val* )
+ ( Object.keys( *obj* ) we already have since ES5 )
+ Object.values( *obj* )
+ Object.items( *obj* )

The following is more generic equivalent of `Array` iterators.

+ Object.map( *obj*, *fun* *[, ctx]* )
+ Object.filter( *obj*, *fun* *[, ctx]* )
+ Object.some( *obj*, *fun* *[, ctx]* )
+ Object.every( *obj*, *fun* *[, ctx]* )

Like Array.map and like, *fun* are functions with argumets below:

  function( *value*, *key*, *obj* );

Unlike Array.map, where *key* is an integer, *key* is a string.

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
  + http://wiki.ecmascript.org/doku.php?id=harmony:egal
