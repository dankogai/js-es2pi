/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

describe('Function.isBuiltIn', function () {
    var f = function(){};
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
            && Function.isBuiltIn(f) == false
    ));
});

describe('Function.prototype.isBuiltIn', function () {
    it('Object.isBuiltin()', eq(Object.isBuiltIn(), true));
    it('function(){}', eq(function(){}.isBuiltIn(), false));
});
