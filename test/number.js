/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

(function(root){
    'use strict';

    describe('Number constants', function() {
        it('Number.MAX_INTEGER', eq(Number.MAX_INTEGER, 9007199254740992));
        it('Number.EPSILON',     eq(Number.EPSILON, 2.220446049250313e-16));
    });
    describe('Number.parseInt()', function () {
        it('Number.parseInt("42",10)', eq(Number.parseInt("42",10), 42));
        it('Number.parseInt("07",10)', eq(Number.parseInt("07",10),  7));
    });
    describe('Number.parseFloat()', function () {
        it('Number.parseFloat("3.14",10)', 
           eq(Number.parseFloat("3.14",10), 3.14));
    });

    var integers = [42, -42, -9007199254740991, 9007199254740991, 0, -0];
    var nonIntegers = [-9007199254741992, 9007199254741992, Math.PI];
    var infinities = [Infinity, -Infinity];
    var nonNumbers = [void 0, true, null, {}, [], 'str'];
    var valuesOf   = [
        {valueOf:function(){return  42}},
        {valueOf:function(){return -42}},
        {valueOf:function(){return  '42'}},
        {valueOf:function(){return  {}}}
    ];

    describe('Number.isFinite()', function() {
        integers.forEach(function(v){
            it('Number.isFinite('+v+')', eq(Number.isFinite(v), true));
            it('('+v+').isFinite()', eq(v.isFinite(), true));
        });
        infinities.forEach(function(v){
            it('Number.isFinite('+v+')', eq(Number.isFinite(v), false));
            it('('+v+').isFinite()', eq(v.isFinite(), false));
        });
        it('Number.isFinite('+NaN+')', eq(Number.isFinite(NaN), false));
        it('('+NaN+').isFinite', eq((0/0).isFinite(), false));
        nonNumbers.forEach(function(v){
            it('Number.isFinite('+v+')', eq(Number.isFinite(v), false));
        });
        valuesOf.forEach(function(v){
            it('Number.isFinite('+v+')', eq(Number.isFinite(v), false));
        });
    });

    describe('Number.isNaN()', function() {
        it('Number.isNaN('+NaN+')', eq(Number.isNaN(NaN), true));
        it('('+NaN+').isNaN()', eq((0/0).isNaN(), true));
        integers.forEach(function(v){
            it('Number.isNaN('+v+')', eq(Number.isNaN(v), false));
            it('('+v+').isNaN()', eq(v.isNaN(), false));
        });
        infinities.forEach(function(v){
            it('Number.isNaN('+v+')', eq(Number.isNaN(v), false));
            it('('+v+').isNaN()', eq(v.isNaN(), false));
        });
        nonNumbers.forEach(function(v){
            it('Number.isNaN('+v+')', eq(Number.isNaN(v), false));
        });
        valuesOf.forEach(function(v){
            it('Number.isNaN('+v+')', eq(Number.isNaN(v), false));
        });
    });

    describe('Number.toInteger()', function() {
        it('Number.toInteger(42)',      eq(Number.toInteger(42),       42));
        it('Number.toInteger(42.0)',    eq(Number.toInteger(42.0),     42));
        it('Number.toInteger(42.195)',  eq(Number.toInteger(42.195),   42));
        it('Number.toInteger(-42)',     eq(Number.toInteger(-42),     -42));
        it('Number.toInteger(-42.0)',   eq(Number.toInteger(-42.0),   -42));
        it('Number.toInteger(-42.195)', eq(Number.toInteger(-42.195), -42));
        it('Number.toInteger(0)',       eq(Number.toInteger(0),         0));
        it('Number.toInteger(-0)',      eq(Number.toInteger(-0),       -0));
        it('Number.toInteger(1/0)',     eq(Number.toInteger(1/0),   Infinity));
        it('Number.toInteger(-1/0)',    eq(Number.toInteger(-1/0), -Infinity));
        it('Number.toInteger(0/0)',     eq(Number.toInteger(0/0), 0));
        var answers = [42, -42, 42, 0];
        for (var i = 0, l = valuesOf.length; i < l; ++i) {
            var v = valuesOf[i];
            it('Number.toInteger('+v+')', eq(Number.toInteger(v), answers[i]));
        };
    });

})(this);
