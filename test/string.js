/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

describe('String.prototype.repeat', function () {
    it('"string".repeat(0)', eq("string".repeat(0), ''));
    it('"".repeat(100)',     eq("".repeat(100), ''));
    it('"string".repeat(3)', eq("string".repeat(3), 'stringstringstring'));
});
