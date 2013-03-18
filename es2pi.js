/*
 * $Id: es2pi.js,v 0.1 2013/03/18 06:36:50 dankogai Exp dankogai $
 *
 *  (c) 2013 Dan Kogai
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 */

(function(root) {
    'use strict';
    // exported functions: function public(...){...}
    // private  functions: var private = function(...){...}
    var functionToString = Function.prototype.toString;
    function isFunction(f)  { return typeof(f) === 'function' };
    var _isBuiltIn = function(f) {
        if (!f) f = Function;
        if (!isFunction(f)) return false;
        try {
            var body = functionToString.call(f).replace(/^[^{]+/,'');
            return !(new Function(body));
        } catch (e) {
            return true;
        }
    };
    if (!_isBuiltIn(Object.freeze)){ // am I paranoid ?
        throw Error('ES5 support required');
    }
    var create = Object.create,
    defineProperty = Object.defineProperty,
    defineProperties = Object.defineProperties,
    getOwnPropertyNames = Object.getOwnPropertyNames,
    keys = Object.keys,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getPrototypeOf = Object.getPrototypeOf,
    freeze = Object.freeze,
    isFrozen = Object.isFrozen,
    isSealed = Object.isSealed,
    seal = Object.seal,
    isExtensible = Object.isExtensible,
    preventExtensions = Object.preventExtensions,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString,
    isArray = Array.isArray,
    slice = Array.prototype.slice,
    sort = Array.prototype.sort;
    // Utility functions; some exported
    function extend(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            )
        });
        return dst;
    };
    function defaults(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            );
        });
        return dst;
    };
    var defspec = extend( 
        create(null), getOwnPropertyDescriptor(Object, 'freeze')
    );
    delete defspec.value;
    var toSpec = function(v) { 
        return typeof(v) !== 'function' ? v
            : extend(extend(create(null), defspec), { value: v });
    };
    var defSpecs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
            defineProperty(specs, k, toSpec(src[k]))
        });
        return specs;
    };
    function isObject(o)    { return o === Object(o) };
    function isPrimitive(o) { return o !== Object(o) };
    function isBoolean(o)   { return typeof(o) == 'boolean'};
    function isNumber(o)    { return typeof(o) == 'number' };
    function isString(o)    { return typeof(o) == 'string' };
    var _typeOf = function(o){ return o === null ? 'null' : typeof(o) };
    var signatureOf = function(o) { return toString.call(o) };
    function is (x, y) {
        return x === y
            ? x !== 0 ? true
            : (1 / x === 1 / y) // +-0
        : (x !== x && y !== y); // NaN
    };
    function isnt (x, y) { return !is(x, y) };
    var defaultCK = {
        descriptors:true,
        extensibility:true, 
        enumerator:getOwnPropertyNames
    };
    var HASWEAKMAP = (function() { // paranoia check
        try {
            var wm = WeakMap();
            wm.set(wm, wm);
            return wm.get(wm) === wm;
        } catch(e) {
            return false;
        }
    })();
    function equals (x, y, ck) {
        var vx, vy;
        if (HASWEAKMAP) {
            vx = WeakMap();
            vy = WeakMap();
        }
        ck = defaults(ck || {}, defaultCK);
        return (function _equals(x, y) {
            if (isPrimitive(x)) return is(x, y);
            if (isFunction(x))  return is(x, y);
            // check deeply
            var sx = signatureOf(x), sy = signatureOf(y);
            var i, l, px, py, sx, sy, kx, ky, dx, dy, dk;
            if (sx !== sy) return false;
            switch (sx) {
            case '[object Array]':
            case '[object Object]':
                if (ck.extensibility) {
                    if (isExtensible(x) !== isExtensible(y)) return false;
                    if (isSealed(x) !== isSealed(y)) return false;
                    if (isFrozen(x) !== isFrozen(y)) return false;
                }
                if (vx) {
                    if (vx.has(x)) {
                        // console.log('circular ref found');
                        return vy.has(y);
                    }
                    vx.set(x, true);
                    vy.set(y, true);
                }
                px = ck.enumerator(x);
                py = ck.enumerator(y);
                if (px.length != py.length) return false;
                px.sort(); py.sort();
                iter: for (i = 0, l = px.length; i < l; ++i) {
                    kx = px[i];
                    ky = py[i];
                    if (kx !== ky) return false;
                    dx = getOwnPropertyDescriptor(x, ky);
                    dy = getOwnPropertyDescriptor(y, ky);
                    if (ck.filter && !ck.filter(dx, kx, x)) continue iter;
                    if ('value' in dx) {
                        if (!_equals(dx.value, dy.value)) return false;
                    } else {
                        if (dx.get && dx.get !== dy.get) return false;
                        if (dx.set && dx.set !== dy.set) return false;
                    }
                    if (ck.descriptors) {
                        if (dx.enumerable !== dy.enumerable) return false;
                        if (ck.extensibility) {
                            if (dx.writable !== dy.writable)
                                return false;
                            if (dx.configurable !== dy.configurable)
                                return false;
                        }
                    }
                }
                return true;
            case '[object RegExp]':
            case '[object Date]':
            case '[object String]':
            case '[object Number]':
            case '[object Boolean]':
                return ''+x === ''+y;
            default:
                throw TypeError(sx + ' not supported');
            }
        })(x, y);
    }
    function clone(src, deep, ck) {
        var wm;
        if (deep && HASWEAKMAP) {
            wm = WeakMap();
        }
        ck = defaults(ck || {}, defaultCK);
        return (function _clone(src) {
            // primitives and functions
            if (isPrimitive(src)) return src;
            if (isFunction(src)) return src;
            var sig = signatureOf(src);
            switch (sig) {
            case '[object Array]':
            case '[object Object]':
                if (wm) {
                    if (wm.has(src)) {
                        // console.log('circular ref found');
                        return src;
                    }
                    wm.set(src, true);
                }
                var isarray = isArray(src);
                var dst = isarray ? [] : create(getPrototypeOf(src));
                ck.enumerator(src).forEach(function(k) {
                    // Firefox forbids defineProperty(obj, 'length' desc)
                    if (isarray && k === 'length') {
                        dst.length = src.length;
                    } else {
                        if (ck.descriptors) {
                            var desc = getOwnPropertyDescriptor(src, k);
                            if (ck.filter && !ck.filter(desc, k, src)) return;
                            if (deep && 'value' in desc) 
                                desc.value = _clone(src[k]);
                            defineProperty(dst, k, desc);
                        } else {
                            dst[k] = _clone(src[k]);
                        }
                    }
                });
                if (ck.extensibility) {
                    if (!isExtensible(src)) preventExtensions(dst);
                    if (isSealed(src)) seal(dst);
                    if (isFrozen(src)) freeze(dst);
                }
                return dst;
            case '[object RegExp]':
            case '[object Date]':
            case '[object String]':
            case '[object Number]':
            case '[object Boolean]':
                return deep ? new src.constructor(src.valueOf()) : src;
            default:
                throw TypeError(sig + ' is not supported');
            }
        })(src);
    };
    // Functions that Return constant values
    function yes(){ return true };
    function no(){ return false };
    // Object
    defaults(Object, defSpecs({
        // crutial
        extend: extend,
        defaults: defaults,
        // comparison and cloning
        is: is,
        isnt: isnt,
        clone: clone,
        equals: equals,
        // object as lesser Map
        values: function values(o){ 
            return keys(o).map(function(k){ return o[k] })
        },
        items: function items(o) {
            return keys(o).map(function(k){ return [k, o[k]] })
        },
        has: function has(o, k){ 
            return hasOwnProperty.call(o, k)
        },
        // types
        isNull: function isNull(o){ return o === null },
        isUndefined: function isUndefined(o){ return o === void(0) },
        isNil: function isNil(o){ return o === void(0) || o === null },
        isPrimitive: isPrimitive,
        isBoolean: isBoolean,
        isNumber: isNumber,
        isString: isString,
        isArray: Array.isArray,
        isFunction: isFunction,
        isObject: isObject,
        typeOf: function typeOf(o) {
            return _typeOf(arguments.length < 1 ? this : o);
        },
        classOf: function classOf(o){ 
            return signatureOf(o).slice(8,-1)
        }
    }));
    // Object.prototype // yes, we can!
    defaults(Object.prototype, defSpecs({
        isObject:    yes,
        isArray:     no,
        isBoolean:   no,
        isFunction:  no,
        isNil:       no,
        isNull:      no,
        isNumber:    no,
        isPrimitive: no,
        isString:    no,
        isUndefined: no,
        typeOf:  function(){ return 'object' },
        classOf: function(){
            return signatureOf(this).slice(8,-1)
        }
    }));
    // Function
    defaults(Function, defSpecs({
        isFunction: isFunction,
        isBuiltIn: _isBuiltIn
    }));
    defaults(Function.prototype, defSpecs({
        isFunction:  yes,
        isNil:       no,
        isNull:      no,
        isUndefined: no,
        typeOf:    function(){ return 'function' },
        classOf:   function(){ return 'Function' },
        isBuiltIn: function(){ return _isBuiltIn(this) }
    }));
    // Boolean
    defaults(Boolean, defSpecs({
        isBoolean: isBoolean
    }));
    defaults(Boolean.prototype, defSpecs({
        isBoolean:   yes,
        isObject:    no,
        isPrimitive: yes,
        typeOf:    function(){ return 'boolean' },
        classOf:   function(){ return 'Boolean' },
        toNumber:  function(){ return 1 * this }
    }));
    // Number
    var _parseInt = parseInt,
    _parseFloat = parseFloat,
    _isFinite = isFinite;
    defaults(Number, defSpecs({
        // ES6
        // http://wiki.ecmascript.org/doku.php?id=harmony:proposals
        MAX_INTEGER: { value: Math.pow(2, 53) },
        EPSILON: { value: Math.pow(2, -52) },
        parseInt: _parseInt,
        parseFloat: _parseFloat,
        isFinite: function(n) { return n === 1 * n && _isFinite(n) },
        isNumber: isNumber,
        isInteger: function(n) { 
            return n === 1 * n && _isFinite(n) && n % 1 === 0 
        },
        isNaN: function(n) { return Object.is(n, NaN) },
        toInteger: function(n) {
            n *= 1;
            return Object.is(n, NaN) ? 0
                : Number.isFinite(n) ? n - n % 1
                : n;
        },
    }));
    // Number.prototype
    defaults(Number.prototype, defSpecs({
        isNumber:    yes,
        isObject:    no,
        isPrimitive: yes,
        typeOf:    function(){ return 'number' },
        classOf:   function(){ return 'Number' },
        isFinite:  function(){ return _isFinite(this) },
        isNan:     function(){ return is(this, NaN) },
        toBoolean: function(){ return !!this },
        toInteger: function(){ 
            return this.isFinite() ? this - this % 1 : this
        }
    }));
    // String
    defaults(String, defSpecs({
        isString: isString
    }));
    // String.prototype
    defaults(String.prototype, defSpecs({
        isString:    yes,
        isObject:    no,
        isPrimitive: yes,
        isUndefined: no,
        typeOf:  function() { return 'string' },
        classOf: function() { return 'String' },
        toBoolean: function() { return !!this },
        toNumber:  function(b) { return parseFloat(this, b||10) },
        toInteger: function(b){ return parseInt(this, b||10) },
        // ES6
        // http://wiki.ecmascript.org/doku.php?id=harmony:string_extras
        repeat: function(n) {
            var s = this,
            result = '';
            for (n *= 1; n > 0; n >>>= 1, s += s) if (n & 1) result += s;
            return result;
        },
        startsWith: function(s) { return this.indexOf(s) === 0 },
        endsWith: function(s) {
            var t = String(s),
            index = this.lastIndexOf(t);
            return index >= 0 && index === this.length - t.length;
        },
        contains: function(s) { return this.indexOf(s) !== -1 },
        // they should've been here from the 1st place
        escape: function(){ return escape(this) },
        encodeURI: function (){ encodeURI(this) },
        encodeURIComponent: function (){ return encodeURIComponent(this) },
        dncodeURI: function (){ return decodeURI(this) },
        dncodeURIComponent: function (){ return _decodeURIComponent(this) }
    }));
    // Array
    defaults(Array, defSpecs({
        // ES6
        from: function(a) {
            return slice.call(a);
        },
        of: function() {
            return slice.call(arguments);
        }
    }));
    // Array.prototype
    defaults(Array.prototype, defSpecs({
        isArray:     function isArray()    { return true  },
        //typeOf: function typeOf(){ return 'array' },
        classOf: function classOf(){ return 'Array' },
        repeat: function(n) {
            var a = this,
            result = [];
            for (n *= 1; n > 0; n >>>= 1, a = a.concat(a)) {
                if (n & 1) result = result.concat(a);
            }
            return result;
        },
        sorted: function() {
            return sort.apply(slice.call(this), slice.call(arguments));
        }
    }));
    // Array.fun for Array.prototype.fun like Firefox
    var arraySpec = {};
    ['join reverse sort',
     'push pop shift unshift splice',
     'concat slice indexOf lastIndexOf',
     'forEach map reduce reduceRight filter some every',
     'repeat sorted']
        .join(' ').split(' ').forEach(function(name){
            var meth = Array.prototype[name];
            arraySpec[name] = function() {
                var args = slice.call(arguments),
                a = args.shift();
                return meth.apply(a, args);
            };
     });
    defaults(Array, defSpecs(arraySpec));
    // Math
    defaults(Math, defSpecs({
        acosh: function acosh(n) { return Math.log(n + Math.sqrt(n*n - 1)) },
        asinh: function asinh(n) { return Math.log(n + Math.sqrt(n*n + 1)) },
        atanh: function atanh(n) { return 0.5 * Math.log((1+n) / (1-n)) },
        cbrt:  function cbrt(n) { return Math.pow(n, 1/3) },
        cosh:  function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2 },
        expm1: function expm1(n) { return Math.exp(n) - 1 },
        hypot: function hypot(x, y) { return Math.sqrt(x*x + y*y) || +0 },
        log2:  function log2(n) { return Math.log(n) / Math.LN2 },
        log10: function log10(n) { return Math.log(n) / Math.LN10 },
        log1p: function log1p(n) { return Math.log(1 + n) },
        sign: function sign(n) {
            n *= 1;
            return n === 0 ? n : Object.is(n, NaN) ? n : n < 0 ? -1 : 1;
        },
        sinh: function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2 },
        tanh: function tanh(n) {
            var u = Math.exp(n),
            d = Math.exp(-n);
            return (u - d) / (u + d);
        },
        trunc: function trunc(n) { return ~~n }
    }));
    // Map
    // cf: https://github.com/dankogai/js-es6-map
    var HASITERABLEMAP = (function(){
        if (!HASWEAKMAP) return false;
        return 'values' in Map();
    })();
    var HASFOROF = (function(){
        try {
            eval('for(var i of [0,1]){}');
            return true;
        } catch(e) {
            // console.log(e);
            return false;
        }
    })();
    (function(){
        if (HASITERABLEMAP) return;  // do nothing if Map is full-featured
        if (!HASFOROF) return;       // do nothing if for-of is absent
        // Firefox can take advantage of this.
        (function(specs){
            extend(Map.prototype, defSpecs(specs));
        })({
            items:eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i);',
                'return result;',
                '})'
            ].join("\n")),
            keys:eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i[0]);',
                'return result;',
                '})'
            ].join("\n")),
            values:eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i[1]);',
                'return result;',
                '})',
            ].join("\n"))
        });
        (function(specs){
            extend(Set.prototype, defSpecs(specs));
        })({
            values:eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i);',
                'return result;',
                '})',
            ].join("\n"))
        });
    })();
    (function(){
        if (HASITERABLEMAP) return; // do nothing if Map is full-featured
        if (HASFOROF) return;       // see previous (function(){})
        // for the rest of us
        var val2str = function(t, v) {
            switch (t) {
            case 'string':
                return '.' + v;
            case 'number':
                return (
                    0 > v ? ''
                        : Object.is(v, -0) ? '-'
                        : v >= 0 ? '+'
                        : ''
                ) + v.toString(10);
            default:
                return '' + v;
            }
        };
        var str2val = function(s) {
            switch (s[0]) {
            case '.':
                return s.substr(1);
            case '+':
            case '-':
            case 'N': // NaN
                return parseFloat(s, 10);
            case 't':
                return true;
            case 'f':
                return false;
            case 'u':
                return undefined;
            case 'n':
                return null;
            default:
                throw new TypeError('unknown format:' + s);
            }
        };
        var indexOfIdentical = function(keys, k) {
            for (var i = 0, l = keys.length; i < l; i++) {
                if (is(keys[i], k)) return i;
            }
            return -1;
        };
        var _Map = function _Map() {
            if (!(this instanceof _Map)) return new _Map();
            defineProperties(this, {
                '__keys': { value: [] },
                '__vals': { value: [] },
                '__hash': { value: {} },
                '__size': { value: 0, writable: true },
                'size': {
                    get: function() {
                        return this.__size;
                    }
                }
            });
        };
        defaults(_Map.prototype, defSpecs({
            has: function has(k) {
                var t = _typeOf(k),
                s;
                if (isPrimitive(k)) {
                    s = val2str(t, k);
                    return s in this.__hash;
                }
                return indexOfIdentical(this.__keys, k) >= 0;
            },
            get: function get(k) {
                var t = _typeOf(k),
                i;
                if (isPrimitive(k)) {
                    return this.__hash[val2str(t, k)];
                } else {
                    i = indexOfIdentical(this.__keys, k);
                    return i < 0 ? undefined : this.__vals[i];
                }
            },
            set: function set(k, v) {
                var t = _typeOf(k),
                i, s;
                if (isPrimitive(k)) {
                    s = val2str(t, k);
                    if (!(s in this.__hash)) this.__size++;
                    this.__hash[s] = v;
                } else {
                    i = indexOfIdentical(this.__keys, k);
                    if (i < 0) {
                        this.__keys.push(k);
                        this.__vals.push(k);
                        this.__size++;
                    } else {
                        this.__keys[i] = k;
                        this.__vals[i] = v;
                    }
                }
            },
            'delete': function (k) { // can't name it in JS
                var t = _typeOf(k),
                i, s;
                if (isPrimitive(k)) {
                    s = val2str(t, k);
                    if (s in this.__hash) {
                        delete this.__hash[s];
                        this.__size--;
                        return true;
                    }
                } else {
                    i = indexOfIdentical(this.__keys, k);
                    if (i >= 0) {
                        this.__keys.splice(i, 1);
                        this.__vals.splice(i, 1);
                        this.__size--;
                        return true;
                    }
                }
                return false;
            },
            keys: function keys() {
                var keys = [],
                hash = this.__hash,
                k;
                for (k in hash) {
                    keys.push(str2val(k));
                }
                return keys.concat(this.__keys);
            },
            values: function values() {
                var vals = [],
                hash = this.__hash,
                k;
                for (k in hash) {
                    vals.push(hash[k]);
                }
                return vals.concat(this.__vals);
            },
            items: function items() {
                var kv = [],
                hash = this.__hash,
                k, i, l;
                for (k in hash) {
                    kv.push([str2val(k), hash[k]]);
                }
                for (i = 0, l = this.__keys.length; i < l; i++) {
                    kv.push([this.__keys[i], this.__vals[i]]);
                }
                return kv;
            },
            clear: function clear() {
                var keys = this.keys();
                while(keys.length) this.delete(keys.pop());
            }
        }));
        // Set
        var _Set = function _Set() {
            if (!(this instanceof _Set)) return new _Set();
            slice.apply(this, slice.call(arguments));
        };
        _Set.prototype = _Map();
        defaults(_Set.prototype, defSpecs({
            add: function(k) { 
                _Map.prototype.set.apply(this, [k, true]) 
            },
            values: function() { 
                return _Map.prototype.keys.apply(this) 
            },
            // mask'em out
            get: {value:undefined},
            set: {value:undefined}
        }));
        // native but incomplete so relocate
        if (HASWEAKMAP) {
            extend(_Map, {__Native__:Map});
            extend(_Set, {__Native__:Set});
        }
        // notice extend is used to override the original
        extend(root, defSpecs({
            Map: _Map,
            Set: _Set
        }));
    })();
})(this);
