/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

describe('Function.isBuiltIn', function () {
    var f = function(){},
    so = ''+f;
    it('Function.isBuiltIn(Object)', 
       eq(Function.isBuiltIn(Object), true));
    it('Function.isBuiltIn(Function)', 
       eq(Function.isBuiltIn(Function), true));
    it('Function.isBuiltIn()', 
       eq(Function.isBuiltIn(), true));
    it('Function.isBuiltIn(function(){})', 
       eq(Function.isBuiltIn(f), false));
    f.toString = (function(fake){
        return function(){ return fake };
    })(Function.prototype.toString.call(Function));
    it('Function.isBuiltIn(function(){}) // fake .toString', ok(
        ('' + f) === Function.prototype.toString.call(Function)
            && Function.isBuiltIn(f) === false
    ));
    it('Function.toString(function(){}) // fake .toString', ok(
        ('' + f) === Function.prototype.toString.call(Function)
            && Function.toString(f) === so
    ));
});

describe('Function.prototype.isBuiltIn', function () {
    it('Object.isBuiltin()', eq(Object.isBuiltIn(), true));
    it('function(){}', eq(function(){}.isBuiltIn(), false));
});

describe('Function.prototype.memoize', function () {
    var memo = [];
    fib = function(n){
        return n < 2 ? n : fib(n - 1) + fib(n - 2) 
    }.memoize(null, memo);
    it('fib(22)',          ok(fib(22) === 17711     && memo.length === 23));
    it('fib(42)',          ok(fib(42) === 267914296 && memo.length === 43));
    it('fib(22) // again', ok(fib(22) === 17711     && memo.length === 43));
});
