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

`Array.prototype.sort` is destructive.  This is the next biggest surprise to
`typeof null === 'object'`.  This is the non-destructive version thereof.

#### Array. *fun* for each Array.prototype. *fun*

And `Array`. *fun* for corresponding `Array.prototype`. *fun* like Firefox
like `Array.sort`

### Type Checking

+ Array.prototype.isArray()
+ Array.prototype.typeOf()
+ Array.prototype.classOf()

### Comparison and Deep Cloning

+ Array.prototype.is( *that* )
+ Array.prototype.isnt( *that* )
+ Array.prototype.equals( *that*, *check* )
+ Array.prototype.clone( *deep*, *check* )


````javascript
var a = [42];
a.is(a);
a.isnt([42]);   // by reference
a.equals([42]); // by value
[42,'Life Universe Everything'.split(' ')].clone(true)
  .equals([42,["Life","Universe","Everything"]]);
````

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
