/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

(function(root){

describe('Math.sign', function() {
    it('Math.sign(+42)',  eq(Math.sign(+42),  +1));
    it('Math.sign(-42)',  eq(Math.sign(-42),  -1));
    it('Math.sign(+0)',   eq(Math.sign(+0),   +0));
    it('Math.sign(-0)',   eq(Math.sign(-0),   -0));
    it('Math.sign(+1/0)', eq(Math.sign(+1/0), +1));
    it('Math.sign(-1/0)', eq(Math.sign(-1/0), -1));
    it('Math.sign(0/0)',  ok(isNaN(Math.sign(0/0))));
});

})(this);
