/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

describe('Function.isBuiltIn', function () {
    it('Object', eq(Function.isBuiltIn(Object), true));
    it('function(){}', eq(Function.isBuiltIn(function(){}), false));
});

describe('Function.prototype.isBuiltIn', function () {
    it('Object', eq(Object.isBuiltIn(), true));
    it('function(){}', eq(function(){}.isBuiltIn(), false));
});
