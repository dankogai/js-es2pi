Array
=====

From ES6:
---------

+ Array.from( *array_like* )
+ Array.of( *[ arg0, arg1 ...]* )

On es6pi:
---------

### Remedial

#### Array.prototype.repeat( *times* )

Repeats the element *times* time.

````javascript
[42].repeat(42); // [42,42...42]
````

Added because I felt it is unfair and consistent when 
`String.prototype.repeat` has made its way to standard.

#### Array.prototype.sorted( *[ comp ]* )

And `Array.`*fun* for corresponding `Array.`prototype.*fun* like Firefox
like `Array.sort`


+ Array.prototype.isArray()
+ Array.prototype.typeOf()
+ Array.prototype.classOf()

#### Comparison

+ Array.prototype.is( *that* )
+ Array.prototype.isnt( *that* )
+ Array.prototype.equals( *that*, *check* )

````javascript
var a = [42];
a.is(a);        // true;
a.is([42]);     // false;
a.equals([42]); // true;
````

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
