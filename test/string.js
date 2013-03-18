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

describe('String.prototype.escape', function() {
    var chars = (function(){
        var a = []
        for (var i = 0; i < 0x3000; ++i); a.push(String.fromCharCode(i));
        return a.join('');
    })();
    var e, eu, euc;
    it ('chars.escape() === escape(chars)', 
        eq(chars.escape(), e = escape(chars)));
    it ('chars.encodeURI() === encodeURI(chars)', 
        eq(chars.encodeURI(), eu = encodeURI(chars)));
    it ('chars.encodeURIComponent() === encodeURIComponent(chars)', 
        eq(chars.encodeURIComponent(), euc = encodeURIComponent(chars)));
    it ('e.unescape() === chars', 
        eq(e.unescape(), chars));
    it ('eu.decodeURI() === chars', 
        eq(eu.decodeURI(), chars));
    it ('euc.decodeURIComponent() === chars',
        eq(euc.decodeURIComponent(), chars));
});
