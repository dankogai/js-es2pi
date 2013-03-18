String
======

From ES6:
---------

+ String.prototype.contains( *str* )
+ String.prototype.endsWith( *str* )
+ String.prototype.repeat( *str* )
+ String.prototype.startsWith( *str* )
+ String.prototype.toArray()

On es2pi:
---------

### Type Checkers

+ String.isString( *unknown* )
+ String.prototype.classOf()
+ String.prototype.typeOf()
+ String.prototype.isString()
+ String.prototype.isPrimitive()

### Type Converters

+ String.prototype.toBoolean()
+ String.prototype.toNumber( *[base]* )
+ String.prototype.toInteger( *[base]* )
+ String.prototype.parseInt( *[base]* )
+ String.prototype.parseFloat( *[base]* )

### Global Functions -> Methods

+ String.prototype.escape()
+ String.prototype.uncape()
+ String.prototype.decodeURI()
+ String.prototype.encodeURI()
+ String.prototype.decodeURIComponent()
+ String.prototype.encodeURIComponent()

### Remedial

#### String.prototype.interpolate( *obj* *[, rx]*)

Does a simple string interpolation.

javascript````
"#{here} #{there} #{nowhere}"
  .interpolate({here:'koko', there:'asoko'});
// "koko asoko undefined"
````

You can pass the optional RegExp *rx* which defaults to
`/#\{.+?\}/g`, resulting a ruby-like format.

cf. http://javascript.crockford.com/remedial.html

See Also:
---------
+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
 + http://wiki.ecmascript.org/doku.php?id=harmony:string.prototype.repeat
