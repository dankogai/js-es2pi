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
        console.log('-'.repeat(16));
        Object.keys(o).forEach(function(k) {
            console.log(k + ':\t', timeit(c, o[k]));
        });
        console.log('='.repeat(16));
    }
    console.log('Object.is.isBuiltIn(); // ', Object.is.isBuiltIn());
    console.log('Object.equals.isBuiltIn(); // ', Object.equals.isBuiltIn());
    timethese(100e3, {
        'Object.is({}, {})': function(){ Object.is({}, {}) },
        'Object.equals({}, {})': function(){ Object.equals({}, {}) },
        '({}).equals({})':       function(){ ({}).equals({}) }
    });
    timethese(10e6, {
        'typeof true':                function(){ typeof true },
        'true.typeOf()':              function(){ true.typeOf()  },
        'typeof true  === "boolean"': function(){ typeof true === "boolean" },
        'true.isBoolean()':           function(){ true.isBoolean()  },
        'typeof 0':                   function(){ typeof 0 },
        '(0).typeOf()':               function(){ (0).typeOf()  },
        'typeof 0  === "number"':     function(){ typeof 0 === "number" },
        '(0).isNumber()':             function(){ (0).isNumber()  },
        'typeof ""':                  function(){ typeof "" },
        '"".typeOf()':                function(){ "".typeOf() },
        'typeof "" === "string"':     function(){ typeof "" === "string" },
        '"".isString()':              function(){ (0).isString()  },
        'typeof []':                  function(){ typeof [] },
        '[].typeOf()':                function(){ [].typeOf() },
        'typeof [] === "object"':     function(){ typeof [] === "object" },
        '"".isObject()':              function(){ (0).isObject()  }
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


