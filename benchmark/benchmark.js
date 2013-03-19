/*
 * usage: node benchmark/benchmark.js
 */
if (this['window'] !== this) {
    require('../es2pi.js');
}

(function(root){
    'use strict';
    var timeit = function(count, fun){
        var started = Date.now();
        var args = [].slice.call(arguments, 2);
        for (var i = 0; i < count; ++i) fun.apply(null, args);
        return Date.now() - started;
    };
    var timethese = function(c, o) {
        console.log(c + ' times');
        console.log('-'.repeat(32));
        Object.keys(o).forEach(function(k) {
            console.log(k + '; //\t', timeit(c, o[k]));
        });
        console.log('='.repeat(32));
    }
    console.log('Object.is.isBuiltIn(); // ',     Object.is.isBuiltIn());
    console.log('Object.equals.isBuiltIn(); // ', Object.equals.isBuiltIn());
    console.log('Object.typeOf.isBuiltIn(); // ', Object.typeOf.isBuiltIn());
    timethese(100e3, {
        'Object.is({}, {})': function(){ Object.is({}, {}) },
        'Object.equals({}, {})': function(){ Object.equals({}, {}) },
        '({}).equals({})':       function(){ ({}).equals({}) }
    });
    timethese(10e6, {
        'typeof true  === "boolean"': function(){ typeof true === "boolean" },
        'Object.isBoolean()':         function(){ true.isBoolean() },
        'true.typeOf()':              function(){ true.typeOf()  },
        'true.classOf()':             function(){ true.classOf() },
        'Object.classOf(true)':       function(){ Object.classOf(true) }
    });
    timethese(10e6, {
        'typeof [] === "object"':     function(){ typeof [] === "object" },
        '[].isObject()':              function(){ [].isObject() },
        'Object.isObject([])':        function(){ Object.isObject([]) },
        '[].typeOf()':                function(){ [].typeOf() },
        'Object.classOf([])':         function(){ Object.classOf([]) },
        '[].classOf()':               function(){ [].classOf() },
        'Array.isArray([])':          function(){ Array.isArray([]) },
        '[].isArray()':               function(){ [].isArray() }
    });
    timethese(10e6, {
        'Object.classOf(/(?:)/)':     function(){ Object.classOf(/(?:)/) },
        '/(?:)/.classOf()':           function(){ /(?:)/.classOf() },
        '/(?:)/.isRegExp()':          function(){ /(?:)/.isRegExp() }
    });
    var a = [], o = {};
    timethese(10e6, {
        'Object.is(0/0, NaN)': function(){ Object.is(0/0,NaN) },
        '(0/0).is(NaN)':       function(){ (0/0).is(NaN) },
        'Object.is(true, !false)': function(){ Object.is(true,!false) },
        'true.is(!false)':         function(){ true.is(!false) },
        'Object.is(""+void(0), "undefined")': function(){
            Object.is(''+void(0), "undefined") 
        },
        '(""+void(0)).is("undefined")': function(){
            (""+void(0)).is("undefined")
        },
        'Object.is([], [])':     function(){ Object.is([], []) },
        '[].is([])':             function(){ [].is([]) },
        'Object.is({}, {})':     function(){ Object.is({}, {}) },
        '({}).is({})':           function(){ ({}).is({}) },
    });
})(this);


