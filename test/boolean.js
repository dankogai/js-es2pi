/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

describe('Boolean.prototype', function () {
    it('false.isBoolean()', eq(false.isBoolean(), true));
    it('true.isBoolean()',  eq(true.isBoolean(),  true));
    it('false.toNumber()',  eq(false.toNumber(), 0));
    it('true.toNumber()',   eq(true.toNumber(),  1));
});
