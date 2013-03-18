Object
======

From ES6:
---------

+ Object.is( *objx*, *objy* )
+ Object.isnt( *objx*, *objy* )

On es2pi:
--------

### Deep Comparison and Cloning

+ Object.equals( *objx*, *objy* *[, check]* )
+ Object.clone( *src*, *[isdeep, check]* )

### Property Management

+ Object.extend( *dst*, *src* )
+ Object.defaults( *dst*, *src* )

### Type Checking

+ Object.tyepeOf( *unknown* )
+ Object.classOf( *unknown* )
+ Object.isObject( *unknown* )
+ Object.isPrimitive( *unknown* )
+ Object.isNull( *unknown* )
+ Object.isUndefined( *unknown* )
+ Object.isNil( *unknown* )
+ Object.isBoolean( *unknown* )
+ Object.isNumber( *unknown* )
+ Object.isString( *unknown* )
+ Object.isArray( *unknown* )
+ Object.isFunction( *unknown* )

#### Prototypal Versions

+ Object.prototype.tyepeOf()
+ Object.prototype.classOf()
+ Object.prototype.isObject()
+ Object.prototype.isPrimitive()
+ Object.prototype.isNull()
+ Object.prototype.isUndefined()
+ Object.prototype.isNil()
+ Object.prototype.isBoolean()
+ Object.prototype.isNumber()
+ Object.prototype.isString()
+ Object.prototype.isArray()
+ Object.prototype.isFunction()

### Object as a Map

+ Object.has( *obj*, *prop* )
+ ( Object.keys( *obj* ) we already have since ES5 )
+ Object.values( *obj* )
+ Object.items( *obj* )

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
  + http://wiki.ecmascript.org/doku.php?id=harmony:egal
