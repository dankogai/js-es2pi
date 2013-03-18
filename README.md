[![build status](https://secure.travis-ci.org/dankogai/js-es2pi.png)](http://travis-ci.org/dankogai/js-es2pi)

es2pi.js
========

ES6 + a little more on top of ES5

Description
-----------

In short, es2pi is a collection of ES6 polyfills + methods missing even in ES6.

### Why reinvented the wheel?

Because:

+ shims/polyfills found to date are not quite optimal, especially `Map` and `Set`.
 + If you want just Map/Set, see https://github.com/dankogai/js-es6-map 
+ ES6 is rather inconsistent in the choice of methods, like...
 + Adding `String.prototype.repeat` while `Array.prototype.repeat` is missing.
   You should be able to go like `var a = [0].repeat(42);`
 + *Type*.is*Type* is available only for `Array`.
 + `typeof null === null` is welcome but shouldn't we add `Object.typeOf`, too?
 + and the `.typeOf()` methods like `'JavaScript'.typeOf() === 'string'` ?

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
+ [Set]
+ [String]
 

[Array]:        Array.md
[Boolean]:      Boolean.md
[Function]:     Function.md
[Map]:          Map.md
[Math]:         Math.md
[Number]:       Number.md
[Object]:       Object.md
[Set]:          Set.md
[String]:       String.md

See Also
--------

+ http://wiki.ecmascript.org/doku.php?id=harmony:proposals
+ https://wiki.mozilla.org/ES6_plans
