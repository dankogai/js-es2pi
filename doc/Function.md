Function
========

From ES6:
---------

On es2pi:
---------

### Type Checkers

+ Function.isFunction( *unknown* )
+ Function.prototype.classOf()
+ Function.prototype.typeOf()
+ Function.prototype.isFunction()

#### Function.isBuiltIn( *unknown* )
#### Function.prototype.isBuiltIn();

Checks if the function is built-in.  False if the function is defined
in JavaScript.  Handy to check if the function is polyfilled.


### Goodies

#### Function.toMethod( *fun* )

Converts the function *fun* to a method, which is a function that
takes `this` as the first argument of the original.

````javascript
String.prototype.to_i = Function.toMethod(parseInt);
"42.195".to_i(); // 42
````

#### Function.prototype.toFunction()

Converts the method to a function whose first argument is bound to 
`this` in the original method.

````
var has = ({}).hasOwnProperty.toFunction();
has({}, 'hasOwnProperty');                // false
has(Object.prototype, 'hasOwnProperty');  // true
````

#### Function.prototype.memoize( *[ toStr, memo ]* )

Turns the function into a memoized version.  The resulting function
first looks up the memo for the argument and if found, returns it.
The original function is invoked iff the argument is not found and
upon return the result is cached in the memo.

````javascript
 var fib = function(n){
    return n < 2 ? n : fib(n - 1) + fib(n - 2) 
 }.memoize();
````

cf. http://en.wikipedia.org/wiki/Memoization

The optional first argument is a function that turns the argument into
the key string.  Default is the identity function (`function(a){return a}`). 

The second argument is an object used for memo.  By default it is
automatically created internally via `Object.create(null)`.

See Also:
---------

+ http://wiki.ecmascript.org/doku.php?id=proposals:builtin_classes
