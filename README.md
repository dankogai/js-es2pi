[![build status](https://secure.travis-ci.org/dankogai/js-es2pi.png)](http://travis-ci.org/dankogai/js-es2pi)

es2pi.js
========

ES6 + a little more on top of ES5

Description
-----------

In short, es2pi is a collection of ES6 polyfills + methods missing even in ES6.

### Why reinvent the wheel?

Because:

+ shims/polyfills found to date are not quite optimal, especially `Map` and `Set`.
 + If you want just Map/Set, see https://github.com/dankogai/js-es6-map 
+ ES6 is rather inconsistent in the choice of methods, like...
 + Adding `String.prototype.repeat` while `Array.prototype.repeat` is missing.
   You should be able to go like `var a = [0].repeat(42);`
 + *Type.isType* is available only for `Array`.
 + `typeof null === null` is welcome but shouldn't we add `Object.typeOf`, too?
 + and the `.typeOf()` methods like `'JavaScript'.typeOf() === 'string'` ?
 + and look, `num.is(42)` is definitely better than `Object.is(num, 42)` !

Thanks to ES5, it is now safe to extend `Object.prototype` via `Object.defineProperty` yet we are still too afraid.  [Underscore.js] is a great hack but a hack nontheless.  Isn't it time to stop wrapping JavaScript's bad parts and extend its good parts?

[Underscore.js]: http://underscorejs.org.

## What is es2pi named after?

2π is a little bigger than 6, isn't it?

Table of Contents
-----------------

+ [Array]
+ [Boolean]
+ [Function]
+ [Map]
+ [Math]
+ [Number]
+ [Object]
  + [Object.clone]
  + [Object.installProperty]
+ [Set]
+ [String]
 

[Array]:                  doc/Array.md
[Boolean]:                doc/Boolean.md
[Function]:               doc/Function.md
[Map]:                    doc/Map.md
[Math]:                   doc/Math.md
[Number]:                 doc/Number.md
[Object]:                 doc/Object.md
[Object.clone]:           doc/Object.clone.md
[Object.installProperty]: doc/Object.installProperty.md
[Set]:                    doc/Set.md
[String]:                 doc/String.md

See Also
--------

+ http://wiki.ecmascript.org/doku.php?id=harmony:proposals
+ https://wiki.mozilla.org/ES6_plans
+ http://kangax.github.com/es5-compat-table/es6/
