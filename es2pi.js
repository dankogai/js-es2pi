/*
 * $Id: es2pi.js,v 0.4 2013/03/20 15:38:07 dankogai Exp dankogai $
 *
 *  (c) 2013 Dan Kogai
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 */

// property installer
// https://github.com/dankogai/js-installproperty

(function(root) {
    'use strict';
    if (typeof Object.installProperty === 'function') return;
    var create = Object.create;
    if (!create || 'hasOwnProperty' in create(null)) {
        throw new Error('ES5 unsupported');
    }
    var nameOfSafe = '__previousProperties__';
    var hasOwnProperty = ''.hasOwnProperty;
    var has = function(o, k) { return hasOwnProperty.call(o, k) };
    var O = Object,
    defineProperty = O.defineProperty,
    defineProperties = O.defineProperties,
    getOwnPropertyDescriptor = O.getOwnPropertyDescriptor,
    getOwnPropertyNames = O.getOwnPropertyNames,
    isArray = Array.isArray;
    var isPrimitive = function(o) {
        return Object(o) !== o;
    };
    // let the show begin!
    function installProperty(target, prop, desc) {
        if (prop === nameOfSafe) return;
        if (isPrimitive(target)) {
            throw new TypeError(target + ' is not an object');
        }
        if (!has(target, nameOfSafe)) { // create safe
            try {
                defineProperty(target, nameOfSafe, {
                    value: create(null),
                    // too fragile ?
                    writable: true,
                    configurable: true
                });
            } catch (e) {
                throw e;
            }
        }
        var safe = target[nameOfSafe], prev;
        if (isArray(target)) { // array needs special andling :-(
            // strictly check if prop is a stringified positive integer
            if (prop.match(/^[0-9]+$/)) {
                // and length will be updated
                if (target.length <= prop * 1) {
                    prev = getOwnPropertyDescriptor(target, 'length');
                    if (!safe['length']) safe['length'] = [];
                    safe['length'].push(prev);
                    target.length = prop;
                }
            }
        }
        prev = getOwnPropertyDescriptor(target, prop);
        if (prev) {
            if (!prev.configurable) return false;
            if (!prev.writable) return true;
        }
        desc.configurable = true;
        desc.writable = true;
        if (!safe[prop]) safe[prop] = [];
        safe[prop].push(prev);
        defineProperty(target, prop, desc);
        return true;
    };
    function defaultProperty(target, prop, desc) {
        return has(target, prop)
            ? false : installProperty(target, prop, desc);
    };
    function revertProperty(target, prop) {
        if (prop === nameOfSafe) return;
        var safe = target[nameOfSafe];
        if (!safe) return;
        if (!safe[prop]) return;
        if (!safe[prop].length) {
            delete safe[prop];
            return;
        }
        var prev = safe[prop].pop();
        if (!prev) {
            delete target[prop];
        } else {
            var curr = getOwnPropertyDescriptor(target, prop);
            defineProperty(target, prop, prev);
            return curr;
        }
    };
    function installProperties(target, descs) {
        getOwnPropertyNames(descs)
            .filter(function(k) {return k !== nameOfSafe})
            .forEach(function(name) {
                installProperty(target, name, descs[name]);
            });
        return target;
    };
    function defaultProperties(target, descs) {
        getOwnPropertyNames(descs)
            .filter(function(k) {return k !== nameOfSafe})
            .forEach(function(name) {
                defaultProperty(target, name, descs[name]);
            });
        return target;
    };
    function revertProperties(target, descs) {
        descs = descs || target[nameOfSafe];
        var prevs = create(null);
        getOwnPropertyNames(descs)
            .filter(function(k) {return k !== nameOfSafe})
            .forEach(function(name) {
                var prev = revertProperty(target, name, descs[name]);
                if (prev) defineProperty(prevs, name, prev);
            });
        return prevs;
    };
    function restoreProperties(target) {
        getOwnPropertyNames(target[nameOfSafe])
            .filter(function(k) {return k !== nameOfSafe})
            .forEach(function(name) {
                var safe = target[nameOfSafe][name],
                desc;
                if (safe && safe.length) {
                    desc = safe[0];
                    if (desc) {
                        // Firefox:
                        // defining the length property on an array
                        // is not currently supported
                        if (isArray(target) && name === 'length') {
                            target.length = safe[0].value;
                        } else {
                            defineProperty(target, name, safe[0]);
                        }
                        return;
                    }
                }
                delete target[name];
            });
        delete target[nameOfSafe];
    };
    var v2s = function(v) {
        return {
            value: v,
            configurable: true,
            writable: true
        };
    };
    defaultProperties(Object, {
        installProperty: v2s(installProperty),
        defaultProperty: v2s(defaultProperty),
        revertProperty: v2s(revertProperty),
        installProperties: v2s(installProperties),
        defaultProperties: v2s(defaultProperties),
        revertProperties: v2s(revertProperties),
        restoreProperties: v2s(restoreProperties)
    });
})(this);
//
// Main Block
//
(function(root) {
    'use strict';
    var defaultProperties = Object.defaultProperties;
    if (!defaultProperties) throw Error('Object.defaultProperties missing');
    // Shorthands for Builtins
    var O = Object, F = Function, A = Array,
    B = Boolean, N = Number, S = String, M = Math,
    OP = O.prototype, FP = Function.prototype, AP = A.prototype,
    BP = B.prototype, NP = Number.prototype, SP = S.prototype,
    // ES5 functions
    create = O.create,
    defineProperties = O.defineProperties,
    defineProperty = O.defineProperty,
    freeze = O.freeze,
    getOwnPropertyDescriptor = O.getOwnPropertyDescriptor,
    getOwnPropertyNames = O.getOwnPropertyNames,
    getPrototypeOf = O.getPrototypeOf,
    hasOwnProperty = OP.hasOwnProperty,
    installProperties = O.installProperties,
    isArray = A.isArray,
    isExtensible = O.isExtensible,
    isFrozen = O.isFrozen,
    isSealed = O.isSealed,
    keys = O.keys,
    preventExtensions = O.preventExtensions,
    seal = O.seal,
    slice = AP.slice,
    sort = AP.sort,
    toString = OP.toString;
    // exported functions: function public(...){...}
    // private  functions: var private = function(...){...}
    function extend(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            );
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
    var obj2specs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
            specs[k] = {
                value: src[k],
                configurable: true,
                writable: true,
                enumerable: false
            };
        });
        return specs;
    };
    var functionToString = FP.toString;
    function isFunction(f)  { return typeof(f) === 'function' };
    var isBuiltIn = function(f) {
        if (arguments.length < 1) return true; // Function.isBuiltin()
        if (!isFunction(f)) return false;
        try {
            var body = functionToString.call(f).replace(/^[^{]+/, '');
            return !(new Function(body));
        } catch (e) {
            return true;
        }
    };
    function isObject(o)    { return o === Object(o) };
    function isPrimitive(o) { return o !== Object(o) };
    var isType = (function(types, classes) {
        var result = {};
        types.forEach(function(typ) {
            var t = typ.toLowerCase();
            result[typ] = function(o) { return typeof o === t };
        });
        classes.forEach(function(cls) {
            var sig = '[object ' + cls + ']';
            result[cls] = function(o) { return toString.call(o) === sig };
        });
        return result;
    })(
        ['Boolean', 'Number', 'String', 'Function'],
        ['Arguments', 'Date', 'RegExp']
    );
    function typeOf(o) { return o === null ? 'null' : typeof(o) };
    function classOf(o) { return toString.call(o).slice(8, -1) };
    var is = O.is || function is(x, y) {
        return x === y
            ? x !== 0 ? true
            : (1 / x === 1 / y) // +-0
        : (x !== x && y !== y); // NaN
    };
    var isnt = O.isnt || function isnt(x, y) { return !is(x, y) };
    var defaultCK = {
        descriptors: true,
        extensibility: true,
        enumerator: getOwnPropertyNames
    };
    var HASWEAKMAP = (function() { // paranoia check
        try {
            var wm = WeakMap();
            wm.set(wm, wm);
            return wm.get(wm) === wm;
        } catch (e) {
            return false;
        }
    })();
    function equals(x, y, ck) {
        var vx, vy;
        if (HASWEAKMAP) {
            vx = WeakMap();
            vy = WeakMap();
        }
        ck = defaults(defaults(create(null), ck || {}), defaultCK);
        return (function _equals(x, y) {
            if (isPrimitive(x)) return is(x, y);
            if (isFunction(x)) return is(x, y);
            // check deeply
            var sx = toString.call(x), sy = toString.call(y);
            var i, l, px, py, sx, sy, kx, ky, dx, dy, dk, flt;
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
                if (ck.filter) {
                    flt = function(k, i, o) {
                        var d = getOwnPropertyDescriptor(this, k);
                        return ck.filter(d, k, this);
                    };
                    px = px.filter(flt, x);
                    py = py.filter(flt, y);
                }
                if (px.length !== py.length) return false;
                px.sort(); py.sort();
                for (i = 0, l = px.length; i < l; ++i) {
                    kx = px[i];
                    ky = py[i];
                    if (kx !== ky) return false;
                    dx = getOwnPropertyDescriptor(x, ky);
                    dy = getOwnPropertyDescriptor(y, ky);
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
                return '' + x === '' + y;
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
        ck = defaults(defaults(create(null), ck || {}), defaultCK);
        return (function _clone(src) {
            // primitives and functions
            if (isPrimitive(src)) return src;
            if (isFunction(src)) return src;
            var sig = toString.call(src);
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
    // generic iterator functions
    function values(o) {
        return keys(o).map(function(k) { return o[k] });
    };
    function items(o) {
        return keys(o).map(function(k) { return [k, o[k]] });
    };
    var _iter_precheck = function(o, f) {
        if (isPrimitive(o)) throw new TypeError(o + ' is not iterable.');
        if (!isFunction(f)) throw new TypeError(f + ' is not callable.');
    };
    var _iter_postprocess = function(src, dst) {
        if (!isExtensible(src)) preventExtensions(dst);
        if (isSealed(src)) seal(dst);
        if (isFrozen(src)) freeze(dst);
    };
    function map(o, f, ctx) {
        if (isArray(o)) return o.map(f, ctx);
        _iter_precheck(o, f);
        var ret = create(getPrototypeOf(o));
        keys(o).forEach(function(k) {
            ret[k] = f.call(ctx, o[k], k, o);
        });
        _iter_postprocess(o, ret);
        return ret;
    };
    function filter(o, f, ctx) {
        if (isArray(o)) return o.filter(f, ctx);
        _iter_precheck(o, f);
        var ret = create(getPrototypeOf(o));
        keys(o).forEach(function(k) {
            if (f.call(ctx, o[k], k, o)) ret[k] = o[k];
        });
        _iter_postprocess(o, ret);
        return ret;
    };
    function some(o, f, ctx) {
        if (isArray(o)) return o.every(f, ctx);
        _iter_precheck(o, f);
        var ks = keys(o), l = ks.length, i, k;
        for (i = 0; i < l; ++i) {
            k = ks[i];
            if (f.call(ctx, o[k], k, o)) return true;
        }
        return false;
    };
    function every(o, f, ctx) {
        if (isArray(o)) return o.every(f, ctx);
        _iter_precheck(o, f);
        var ks = keys(o), l = ks.length, i, k;
        for (i = 0; i < l; ++i) {
            k = ks[i];
            if (!f.call(ctx, o[k], k, o)) return false;
        }
        return true;
    };
    // Functions that Return constant values
    function yes() { return true };
    function no() { return false };
    // more functions
    function identity(a) { return a };
    function has(o, k) { return hasOwnProperty.call(o, k) };
    function get(o, k) { return has(o, k) ? o[k] : undefined };
    function set(o, k, v) { o[k] = v };
    // and methods
    function isThis(that) { return this === that };
    function isReally(that) { return is(this, that) };
    function isntThis(that) { return this !== that };
    function isntReally(that) { return isnt(this, that) };
    function equalsThis(that, check) { return equals(this, that, check) };
    function cloneThis(deep, check) { return clone(this, deep, check) };
    function itself() { return this };
    function classOfThis() { return classOf(this) };
    // Object
    defaultProperties(O, obj2specs({
        // crutial
        extend: extend,
        defaults: defaults,
        // comparison and cloning
        is: is,
        isnt: isnt,
        clone: clone,
        equals: equals,
        // object as lesser Map
        values: values,
        items: items,
        has: has,
        get: get,
        set: set,
        map: map,
        filter: filter,
        some: some,
        every: every,
        // types
        isNull: function(o) { return o === null },
        isUndefined: function(o) { return o === void(0) },
        isNil: function(o) { return o === void(0) || o === null },
        isPrimitive: isPrimitive,
        isBoolean: isType.Boolean,
        isNumber: isType.Number,
        isString: isType.String,
        isArguments: isType.Arguments,
        isDate: isType.Date,
        isRegExp: isType.RegExp,
        isArray: isArray,
        isFunction: isType.Function,
        isObject: isObject,
        typeOf: typeOf,
        classOf: classOf
    }));
    // Object.prototype // yes, we can!
    defaultProperties(OP, obj2specs({
        isObject: yes,
        isArray: no,
        isBoolean: no,
        isFunction: no,
        isNil: no,
        isNull: no,
        isNumber: no,
        isPrimitive: no,
        isString: no,
        isUndefined: no,
        isDate: no,
        isRegExp: no,
        isArguments: no,
        typeOf: function() { return 'object' },
        classOf: classOfThis,
        is: isThis,
        isnt: isntThis,
        equals: equalsThis,
        clone: cloneThis
    }));
    // Function
    defaultProperties(Function, obj2specs({
        isFunction: isFunction,
        isBuiltIn: isBuiltIn,
        identity: identity,
        toString: function(f) {
            if (arguments.length < 1) f = Function;
            return functionToString.call(f);
        }
    }));
    defaultProperties(FP, obj2specs({
        isFunction: yes,
        isNil: no,
        isNull: no,
        isUndefined: no,
        typeOf: function() { return 'function' },
        classOf: function() { return 'Function' },
        is: isThis,
        isnt: isntThis,
        equals: isThis,
        clone: itself,
        isBuiltIn: function() { return isBuiltIn(this) },
        memoize: function(toStr, memo) {
            toStr = toStr || identity;
            memo = memo || create(null);
            var that = this;
            return function() {
                var key = toStr.apply(this, arguments);
                if (has(memo, key)) return memo[key];
                return memo[key] = that.apply(this, arguments);
            };
        }
    }));
    // Boolean
    defaultProperties(B, obj2specs({
        isBoolean: isType.Boolean
    }));
    defaultProperties(BP, obj2specs({
        isBoolean: yes,
        isObject: no,
        isPrimitive: yes,
        is: isThis,
        isnt: isntThis,
        equals: isThis,
        clone: itself,
        typeOf: function() { return 'boolean' },
        classOf: function() { return 'Boolean' },
        toNumber: function() { return 1 * this }
    }));
    // Number
    defaultProperties(N, obj2specs({
        MAX_INTEGER: M.pow(2, 53),
        EPSILON: M.pow(2, -52),
        // ES6
        // http://wiki.ecmascript.org/doku.php?id=harmony:proposals
        parseInt: parseInt,
        parseFloat: parseFloat,
        isFinite: function(n) { return n === 1 * n && isFinite(n) },
        isNumber: isType.Number,
        isInteger: function(n) {
            return n === 1 * n && isFinite(n) && n % 1 === 0;
        },
        isNaN: function(n) { return is(n, NaN) },
        toInteger: function(n) {
            n *= 1;
            return is(n, NaN) ? 0 : isFinite(n) ? n - n % 1 : n;
        }
    }));
    // Number.prototype
    defaultProperties(NP, obj2specs({
        isNumber: yes,
        isObject: no,
        isPrimitive: yes,
        typeOf: function() { return 'number' },
        classOf: function() { return 'Number' },
        isFinite: function() { return isFinite(this) },
        isNaN: function() { return is(this, NaN) },
        toBoolean: function() { return !!this },
        toInteger: function() {
            return this.isFinite() ? this - this % 1 : this;
        },
        is: isReally,
        isnt: isntReally,
        equals: isReally,
        clone: itself
    }));
    // String
    defaultProperties(String, obj2specs({
        isString: isType.String
    }));
    // String.prototype
    defaultProperties(String.prototype, obj2specs({
        isString: yes,
        isObject: no,
        isPrimitive: yes,
        isUndefined: no,
        is: isThis,
        isnt: isntThis,
        equals: isThis,
        clone: itself,
        typeOf: function() { return 'string' },
        classOf: function() { return 'String' },
        toBoolean: function() { return !!this },
        toNumber: function(b) { return parseFloat(this, b || 10) },
        toInteger: function(b) { return parseInt(this, b || 10) },
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
        escape: function() { return escape(this) },
        unescape: function() { return unescape(this) },
        encodeURI: function() { return encodeURI(this) },
        encodeURIComponent: function() { return encodeURIComponent(this) },
        decodeURI: function() { return decodeURI(this) },
        decodeURIComponent: function() { return decodeURIComponent(this) },
        interpolate: function(o, r) {
            if (!r) r = /#\{(.+?)\}/g;
            return this.replace(r, function(m, k) { return o[k] });
        }
    }));
    // Array
    defaultProperties(Array, obj2specs({
        // ES6
        from: function(a) {
            return slice.call(a);
        },
        of: function() {
            return slice.call(arguments);
        }
    }));
    // Array.prototype
    defaultProperties(Array.prototype, obj2specs({
        isArray: yes,
        //typeOf: function typeOf(){ return 'array' },
        classOf: function classOf() { return 'Array' },
        repeat: function(n) {
            var a = this,
            result = [];
            for (n *= 1; n > 0; n >>>= 1, a = a.concat(a)) {
                if (n & 1) result = result.concat(a);
            }
            return result;
        },
        sorted: function() {
            return sort.apply(slice.call(this), arguments);
        }
    }));
    // Array.fun for Array.prototype.fun like Firefox
    var arrayMeths = {};
    ['join reverse sort',
     'push pop shift unshift splice',
     'concat slice indexOf lastIndexOf',
     'forEach map reduce reduceRight filter some every',
     'repeat sorted']
        .join(' ').split(' ').forEach(function(name) {
            var meth = AP[name];
            arrayMeths[name] = function() {
                var args = slice.call(arguments),
                a = args.shift();
                return meth.apply(a, args);
            };
        });
    defaultProperties(Array, obj2specs(arrayMeths));
    // RegExp
    defaultProperties(RegExp, obj2specs({
        isRegExp: isType.RegExp
    }));
    defaultProperties(RegExp.prototype, obj2specs({
        isRegExp: yes,
        classOf: function() { return 'RegExp' }
    }));
    // Date
    defaultProperties(Date, obj2specs({
        isDate: isType.Date
    }));
    defaultProperties(Date.prototype, obj2specs({
        isDate: yes,
        classOf: function() { return 'Date' }
    }));
    // Arguments
    // is not extensible!
    /*
      var Arguments = (function(){return arguments}).constructor;
      defaultProperties(Arguments, obj2specs({
      isArguments: isType.Arguments
      }));
      defaultProperties(Arguments.prototype, obj2specs({
      Arguments: yes
      }));
    */
    // Math
    defaultProperties(Math, obj2specs({
        acosh: function acosh(n) { return M.log(n + M.sqrt(n * n - 1)) },
        asinh: function asinh(n) { return M.log(n + M.sqrt(n * n + 1)) },
        atanh: function atanh(n) { return 0.5 * M.log((1 + n) / (1 - n)) },
        cbrt: function cbrt(n) { return M.pow(n, 1 / 3) },
        cosh: function cosh(n) { return (M.exp(n) + M.exp(-n)) / 2 },
        expm1: function expm1(n) { return M.exp(n) - 1 },
        hypot: function hypot(x, y) { return M.sqrt(x * x + y * y) || +0 },
        log2: function log2(n) { return M.log(n) / M.LN2 },
        log10: function log10(n) { return M.log(n) / M.LN10 },
        log1p: function log1p(n) { return M.log(1 + n) },
        sign: function sign(n) {
            n *= 1;
            return n === 0 ? n : is(n, NaN) ? n : n < 0 ? -1 : 1;
        },
        sinh: function sinh(n) { return (M.exp(n) - M.exp(-n)) / 2 },
        tanh: function tanh(n) {
            var u = M.exp(n),
            d = M.exp(-n);
            return (u - d) / (u + d);
        },
        trunc: function trunc(n) { return ~~n }
    }));
    // Map
    // cf: https://github.com/dankogai/js-es6-map
    var HASITERABLEMAP = (function() {
        if (!HASWEAKMAP) return false;
        return 'values' in Map();
    })();
    var HASFOROF = (function() {
        try {
            eval('for(var i of [0,1]){}');
            return true;
        } catch (e) {
            // console.log(e);
            return false;
        }
    })();
    (function() {
        if (HASITERABLEMAP) return;  // do nothing if Map is full-featured
        if (!HASFOROF) return;       // do nothing if for-of is absent
        // Firefox can take advantage of this.
        defaultProperties(Map.prototype, obj2specs({
            items: eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i);',
                'return result;',
                '})'
            ].join('\n')),
            keys: eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i[0]);',
                'return result;',
                '})'
            ].join('\n')),
            values: eval([
                '(function (){',
                'var result = [];',
                'for (var i of this) result.push(i[1]);',
                'return result;',
                '})'
            ].join('\n'))
        }));
    })();
    (function() {
        if (HASITERABLEMAP) return; // do nothing if Map is full-featured
        if (HASFOROF) return;       // see the previous (function(){})
        // for the rest of us
        var val2str = function(t, v) {
            switch (t) {
            case 'string':
                return '.' + v;
            case 'number':
                return (
                    0 > v ?           ''
                        : is(v, -0) ? '-'
                        : v >= 0    ? '+'
                        :             ''
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
        defaultProperties(_Map.prototype, obj2specs({
            has: function(k) {
                var t = typeOf(k),
                s;
                if (isPrimitive(k)) {
                    s = val2str(t, k);
                    return s in this.__hash;
                }
                return indexOfIdentical(this.__keys, k) >= 0;
            },
            get: function(k) {
                var t = typeOf(k),
                i;
                if (isPrimitive(k)) {
                    return this.__hash[val2str(t, k)];
                } else {
                    i = indexOfIdentical(this.__keys, k);
                    return i < 0 ? undefined : this.__vals[i];
                }
            },
            set: function(k, v) {
                var t = typeOf(k),
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
            'delete': function(k) {
                var t = typeOf(k),
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
            keys: function() {
                var keys = [],
                hash = this.__hash,
                k;
                for (k in hash) {
                    keys.push(str2val(k));
                }
                return keys.concat(this.__keys);
            },
            values: function() {
                var vals = [],
                hash = this.__hash,
                k;
                for (k in hash) {
                    vals.push(hash[k]);
                }
                return vals.concat(this.__vals);
            },
            items: function() {
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
            clear: function() {
                var keys = this.keys();
                while (keys.length) this.delete(keys.pop());
            }
        }));
        // Set
        var _Set = function _Set() {
            if (!(this instanceof _Set)) return new _Set();
            slice.apply(this, slice.call(arguments));
        };
        _Set.prototype = _Map();
        defaultProperties(_Set.prototype, obj2specs({
            add: function(k) {
                _Map.prototype.set.apply(this, [k, true]);
            },
            values: function() {
                return _Map.prototype.keys.apply(this);
            },
            // mask'em out
            get:   { value: undefined },
            set:   { value: undefined },
            keys:  { value: undefined },
            items: { value: undefined }
        }));
        // notice installProperteies is used to override the original
        installProperties(root, obj2specs({
            Map: _Map,
            Set: _Set
        }));
    })();
})(this);
