/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    var ns = require('../es2pi.js');
    Map = ns.Map;
}
var equals = Object.equals;
var truthy = [
    true, 'true', 1, '1', Math.E, Math.PI,
    Number.MAX_VALUE, Number.MIN_VALUE
].sort();
describe('Map truthy primitives', function () {
    'use strict';
    var m = Map(),
    i, j, l, v, v2;
    for (i = 0, l = truthy.length; i < l; ++i) {
        v = truthy[i];
        m.set(v, v);
        it('m.get(' + v + ')', ok(Object.is(m.get(v), v)));
        it('m.has(' + v + ')', ok(Object.is(m.has(v), true)));
    }
    it('m.size', eq(m.size, truthy.length));
    it('m.keys()', ok(equals(m.keys().sort(), truthy)));
    it('m.values()', ok(equals(m.values().sort(), truthy)));
    it('m.items()', ok(equals(
        m.items().sort(),
        truthy.map(function (v) { return [v, v] }).sort()
    )));
    for (i = 0, l = truthy.length; i < l; ++i) {
        v = truthy[i];
        it('m.delete(' + v + ')', eq(m.delete(v), true));
        it('m.delete(' + v + ') again', eq(m.delete(v), false));
        it('m.has(' + v + ')', eq(m.has(v), false));
    }
    it('m.size', eq(m.size, 0));
    it('m.keys()', ok(equals(m.keys(), [])));
    it('m.values()', ok(equals(m.values(), [])));
    it('m.items()', ok(equals(m.items(), [])));
});


var falsy = [undefined, null, false, 0, -0, 0/0, ''].sort();
describe('Map falsy primitives', function () {
    'use strict';
    var m = Map(),
        i, j, l, v, v2;
    for (i = 0, l = falsy.length; i < l; ++i) {
        v = falsy[i];
        m.set(v, v);
        it('m.get(' + v + ')', ok(Object.is(m.get(v), v)));
        it('m.has(' + v + ')', ok(Object.is(m.has(v), true)));
    }
    it('m.size', eq(m.size, falsy.length));
    it('m.keys()', ok(equals(m.keys().sort(), falsy)));
    it('m.values()', ok(equals(m.values().sort(), falsy)));
    it('m.items()', ok(equals(
        m.items().sort(),
        falsy.map(function (v) { return [v, v]}).sort()
    )));
    for (i = 0, l = falsy.length; i < l; ++i) {
        v = falsy[i];
        for (j = 0; j < l; ++j) {
            if (i === j) continue;
            v2 = falsy[j];
            it(v + '!==' + v2, ok(Object.isnt(m.get(v2), v)));
        }
    };
    for (i = 0, l = falsy.length; i < l; ++i) {
        v = falsy[i];
        it('m.delete(' + v + ')', eq(m.delete(v), true));
        it('m.delete(' + v + ') again', eq(m.delete(v), false));
        it('m.has(' + v + ')', eq(m.has(v), false));
    }
    it('m.size', eq(m.size, 0));
    it('m.keys()', ok(equals(m.keys(), [])));
    it('m.values()', ok(equals(m.values(), [])));
    it('m.items()', ok(equals(m.items(), [])));
    for (i = 0, l = falsy.length; i < l; ++i) {
        v = falsy[i];
        m.set(v, v);
    }
    m.clear();
    it('m.clear', eq(m.size, 0));
});

var a = [],
    o = {}, f = function () {}, r = /./g,
    d = new Date(0);
var objs = [a, o, f, r, d].sort();

describe('Map objects', function () {
    var m = Map(),
        i, j, l, v;
    for (i = 0, l = objs.length; i < l; ++i) {
        v = objs[i];
        m.set(v, v);
        it('m.get(' + v + ')', eq(m.get(v), v));
        it('m.has(' + v + ')', eq(m.has(v), true));
    }
    it('m.size', eq(m.size, objs.length));
    it('m.keys()', ok(equals(m.keys().sort(), objs)));
    it('m.values()', ok(equals(m.values().sort(), objs)));
    it('m.items()', ok(equals(
        m.items().sort(),
        objs.map(function (v) { return [v, v] }).sort()
    )));

    it('m.get(' + a + ')', ok(m.get(a) !== []));
    it('m.get(' + a + ')', ok(equals(m.get(a), [])));
    // functions are not compared by value
    it('m.get(' + f + ')', ok(m.get(f) !== function () {}));
    it('m.get(' + f + ')', eq(equals(m.get(f), function () {}), false));
    it('m.get(' + o + ')', ok(m.get(o) !== {}));
    it('m.get(' + o + ')', ok(equals(m.get(o), {})));
    it('m.get(' + r + ')', ok(m.get(r) !== /./g));
    it('m.get(' + r + ')', ok(equals(m.get(r), /./g)));
    it('m.get(' + d + ')', ok(m.get(d) !== new Date(0)));
    it('m.get(' + d + ')', ok(equals(m.get(d), new Date(0))));
    for (i = 0, l = objs.length; i < l; ++i) {
        v = objs[i];
        it('m.delete(' + v + ')', eq(m.delete(v), true));
        it('m.delete(' + v + ') again', eq(m.delete(v), false));
        it('m.has(' + v + ')', eq(m.has(v), false));
    }
    it('m.size', eq(m.size, 0));
    it('m.keys()', ok(equals(m.keys(), [])));
    it('m.values()', ok(equals(m.values(), [])));
    it('m.items()', ok(equals(m.items(), [])));
    for (i = 0, l = objs.length; i < l; ++i) {
        v = objs[i];
        m.set(v, v);
    }
    m.clear();
    it('m.clear', eq(m.size, 0));
});
