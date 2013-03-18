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

### Object as a Map

+ Object.has( *obj*, *prop* )
+ ( Object.keys( *obj* ) we already have since ES5 )
+ Object.values( *obj* )
+ Object.items( *obj* )

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
  + http://wiki.ecmascript.org/doku.php?id=harmony:egal
