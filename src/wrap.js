/*
 * $Id: wrap.js,v 0.4 2013/03/27 01:59:50 dankogai Exp dankogai $
 *
 *  (c) 2013 Dan Kogai
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 */

(function(root) {
    'use strict';
    if (typeof Object.Wrap === 'function') return;
    var create = Object.create;
    if (!create || 'hasOwnProperty' in create(null)) {
        throw new Error('ES5 unsupported');
    }
    var O = Object, OP = O.prototype,
    A = Array, AP = A.prototype,
    F = Function, FP = F.prototype,
    B = Boolean, BP = B.prototype,
    N = Number, NP = N.prototype,
    S = String, SP = S.prototype,
    R = RegExp, RP = R.prototype,
    D = Date, DP = D.prototype,
    defineProperties = O.defineProperties,
    defineProperty = O.defineProperty,
    getOwnPropertyDescriptor = O.getOwnPropertyDescriptor,
    getOwnPropertyNames = O.getOwnPropertyNames,
    getPrototypeOf = O.getPrototypeOf,
    isPrototypeOf = OP.isPrototypeOf,
    hasOwnProperty = OP.hasOwnProperty,
    keys = O.keys,
    slice = AP.slice,
    toString = OP.toString,
    isArray = A.isArray;
    // exported functions
    // function public(){ ... }
    // internal functions
    // var private = function(){ ... }
    var has = function(o, k) { return hasOwnProperty.call(o, k) };
    var classOf = function(o) {
        var t = typeof o;
        var c = t !== 'object'
            ? t[0].toUpperCase() + t.slice(1)
            : isArray(o) ? 'Array' : toString.call(o).slice(8, -1)
        return c;
    };
    var _valueOf = function() { return this.__value__ };
    var _toString = function() { return '' + this.__value__ };
    var _classOf = function() { return this.__class__ };
    function learn(name, fun, klass) {
        if (typeof name === 'string') {
            this[name] = function() {
                return _(fun.apply(
                    this.value,
                    slice.call(arguments).map(function(v) {
                        return isWrapped(v) ? v.value : v;
                    })), klass);
            };
            defineProperty(this, name, {enumerable: false});
        } else {
            var pairs = name;
            getOwnPropertyNames(pairs).forEach(function(name) {
                var fun = pairs[name]; /* klass = fun.class; */
                this.learn(name, fun);
            }, this);
        }
        return this;
    };
    var uniq = function(a) {
        var seen = create(null);
        for (var i = 0, l = a.length; i < l; ++i) seen[a[i]] = true;
        return keys(seen);
    };
    var getPropertyNames = function(obj) {
        var names = [];
        do {
            names.push.apply(names, getOwnPropertyNames(obj));
            obj = getPrototypeOf(obj);
        } while (obj);
        return uniq(names);
    };
    var methodsOf = function() {
        var meths = [], names = getPropertyNames(this);
        for (var i = 0, l = names.length; i < l; ++i) {
            var k = names[i];
            if (this[k] === methodsOf) break; // or infinite loop!
            if (typeof(this[k]) === 'function') meths.push(k);
        }
        return meths.concat(['methodsOf']).sort();
    };
    var is = O.is || function is(x, y) {
        return x === y
            ? x !== 0 ? true
            : (1 / x === 1 / y) // +-0
        : (x !== x && y !== y); // NaN
    };
    var isThis = function(that) {
        return is(this.value, isWrapped(that) ? that.value : that);
    };
    var isnt = O.isnt || function isnt(x, y) { return !is(x, y) };
    var isntThis = function(that) {
        return isnt(this.value, isWrapped(that) ? that.value : that);
    };
    // Mother of all objects
    var Kernel = create(null, {
        valueOf: { value: _valueOf },
        toString: { value: _toString },
        classOf: { value: _classOf },
        toJSON: { value: _valueOf },
        value: { get: _valueOf },
        'class': { get: _classOf },
        learn: { value: learn },
        is: { value: isThis },
        isnt: { value: isntThis },
        methodsOf: { value: methodsOf },
        methods: { get: methodsOf }
    });
    function isWrapped(o) { return isPrototypeOf.call(Kernel, o) };
    var obj2specs = function(o) {
        var specs = create(null);
        keys(o).forEach(function(k) {
            specs[k] = { value: o[k], writable: true, configurable: true };
        });
        return specs;
    };
    //
    // I am not Underscore; it's just my nickname!
    //
    var _ = function Wrap(that, klass) {
        if (arguments.length < 1) throw TypeError('first argument missing');
        if (_.debug) console.log(arguments);
        // if already wrapped just return that
        if (isWrapped(that)) return that;
        // if unspecifed, check the type of that
        if (!klass) {
            klass = classOf(that);
            if (! _[klass]) return that;
            if (! _[klass].autowrap) return that;
        } else {
            // if klass is true but non-string, investigate
            if (typeof klass !== 'string') klass = classOf(that);
        }
        // wrap only supported types
        return _[klass] ? _[klass](that) : that;
    };
    // _.debug = true;
    _.Kernel = Kernel;
    _.isWrapped = isWrapped;
    // Null
    _.Null = function(b) {
        return create(_.Null.prototype, {
            __value__: { value: null }
        });
    };
    // _.Null.autowrap = true;
    _.Null.prototype = create(Kernel, {
        __class__: { value: 'Null' }
    });
    // Undefined
    _.Undefined = function(b) {
        return create(_.Undefined.prototype, {
            __value__: { value: undefined }
        });
    };
    //_.Undefined.autowrap = true;
    _.Undefined.prototype = create(Kernel, {
        __class__: { value: 'Undefined' }
    });
    // Boolean - wrapped only on explicit request
    _.Boolean = function(b) {
        return create(_.Boolean.prototype, {
            __value__: { value: !!b }
        });
    };
    _.Boolean.prototype = create(Kernel, {
        __class__: { value: 'Boolean' }
    });
    defineProperties(_.Boolean.prototype, obj2specs({
        not: function() {
            return _.Boolean(!this.value);
        },
        and: function(b) {
            return _.Boolean(!!(this.value & _(b, true).value));
        },
        xor: function(b) {
            return _.Boolean(!!(this.value ^ _(b, true).value));
        },
        or: function(b) {
            return _.Boolean(!!(this.value | _(b, true).value));
        }
    }));
    // Number
    _.Number = function(n) {
        return create(_.Number.prototype, {
            __value__: { value: +n }
        });
    };
    _.Number.autowrap = true;
    _.Number.prototype = create(Kernel, {
        __class__: { value: 'Number' }
    });
    _.Number.prototype.learn(omitted(NP, [
        'constructor', 'toString', 'valueOf'
    ]));
    defineProperties(_.Number.prototype, obj2specs({
        toInteger: function(n) { return _.Number(~~this.value) }
    }));
    // String -- without hairy .blink and such
    _.String = function(s) {
        return create(_.String.prototype, {
            __value__: { value: '' + s }
        });
    };
    _.String.autowrap = true;
    _.String.prototype = create(Kernel, {
        __class__: { value: 'String' }
    });
    _.String.prototype.learn(omitted(SP, [
        'length', 'constructor', 'toString', 'valueOf'
    ]));
    defineProperties(_.String.prototype, {
        length: { get: function() { return this.value.length } }
    });
    // Object - wrapped as a collection type
    _.Object = function(o) {
        return create(_.Object.prototype, {
            __value__: { value: o },
            __size__: { value: keys(o).length, writable: true }
        });
    };
    _.Object.prototype = create(Kernel, {
        __class__: { value: 'Object' }
    });
    _.Object.autowrap = true;
    // _.Object.prototype.learn(omitteded(OP, [
    // ]));
    defineProperties(_.Object.prototype, obj2specs({
        has: function(k) { return has(this.__value__, k) },
        get: function(k) { return _(this.__value__[k], true) },
        set: function(k, v) {
            if (!has(this.__value__, k)) this.__size__++;
            return _(this.__value__[k] = v, true);
        },
        'delete': function(k) {
            if (!has(this.__value__, k)) return false;
            this.__size__--;
            delete this.__value__[k];
            return true;
        }
    }));
    function extend(dst, src) {
        var isarray = isArray(src);
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    function copyOf(src) { // shallow copy
        return extend(create(getPrototypeOf(src)), src);
    };
    function defaults(dst, src) {
        var isarray = isArray(src);
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            if (has(dst, k)) return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    function pick(src, lst) {
        var keep = create(null),
        isarray = isArray(src);
        lst.forEach(function(k) { keep[k] = true });
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            if (keep[k]) return;
            delete src[k];
        });
        return src;
    };
    function picked(src, lst) {
        var isarray = isArray(src),
        dst = create(getPrototypeOf(src));
        lst.forEach(function(k) {
            if (isarray && k === 'length') return;
            if (!has(src, k)) return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    function omit(src, lst) {
        var isarray = isArray(src);
        lst.forEach(function(k) {
            if (isarray && k === 'length') return;
            if (!has(src, k)) return;
            delete src[k];
        });
        return src;
    };
    function omitted(src, lst) {
        var ignore = create(null),
        isarray = isArray(src),
        dst = create(getPrototypeOf(src));
        lst.forEach(function(k) { ignore[k] = true });
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            if (has(ignore, k)) return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    _.Object.prototype.learn({
        copyOf: function() { return copyOf(this) },
        keys: function() { return keys(this) },
        values: function() {
            return keys(this).map(function(k) { return this[k] }, this);
        },
        items: function() {
            return keys(this).map(function(k) { return [k, this[k]] }, this);
        },
        extend: function(o) { return extend(this, o) },
        defaults: function(o) { return defaults(this, o) },
        extended: function(o) { return extend(copyOf(this), o) },
        defaulted: function(o) { return defaults(copyOf(this), o) },
        pick: function(lst) {
            return pick(this, isArray(lst) ? lst : slice.call(arguments));
        },
        picked: function(lst) {
            return picked(this, isArray(lst) ? lst : slice.call(arguments));
        },
        omit: function(lst) {
            return omit(this, isArray(lst) ? lst : slice.call(arguments));
        },
        omitted: function(lst) {
            return omitted(this, isArray(lst) ? lst : slice.call(arguments));
        }
    });
    defineProperties(_.Object.prototype, {
        size: {
            get: function() { return this.__size__ }
        }
    });
    // Array
    _.Array = function(a) {
        return create(_.Array.prototype, {
            __value__: { value: a },
            __size__: { value: keys(a).length, writable: true }
        });
    };
    _.Array.autowrap = true;
    // Inheriting from _.Object.prototype
    _.Array.prototype = create(_.Object.prototype, {
        __class__: { value: 'Array' }
    });
    _.Array.prototype.learn(omitted(AP, [
        'length', 'constructor', 'toString', 'valueOf'
    ]));
    var _splice = AP.splice,
    _pop = AP.pop, _push = AP.push,
    _shift = AP.shift, _unshift = AP.unshift;
    defineProperties(_.Array.prototype, obj2specs({
        pop: function() {
            if (!this.value.length) return undefined;
            this.__size__--;
            return _(_pop.call(this.__value__));
        },
        push: function() {
            this.__size__ += keys(arguments).length;
            return _(_push.apply(this.__value__, arguments));
        },
        shift: function() {
            if (!this.value.length) return undefined;
            this.__size__--;
            return _(_shift.call(this.__value__));
        },
        unshift: function() {
            this.__size__ += keys(arguments).length;
            return _(_unshift.apply(this.__value__, arguments));
        },
        splice: function() {
            var ret = _splice.apply(this.__value__, arguments);
            this.__size__ = keys(this.__value__).length;
            return _(ret);
        }
    }));
    defineProperties(_.Array.prototype, {
        length: {
            get: function() { return this.value.length },
            set: function(n) { return this.value.length = _(n).value * 1 }
        }
    });
    // Function - this one is a little tricky
    _.Function = function(f) {
        if (has(f, '__value__') && typeof f.value === 'function') {
            return f;
        }
        var w = f.bind(f);
        // no prototype chain. just compose
        extend(w, Kernel);
        extend(w, _.Function.prototype);
        defineProperties(w, {
            __value__: { value: f }
        });
        return w;
    };
    _.Function.prototype = create(Kernel, {
        __class__: { value: 'Function' }
    });
    _.Function.prototype.learn(picked(FP, [
        'apply', 'call'
    ]));
    // RegExp - wrapped only opon request
    _.RegExp = function(r) {
        return create(_.RegExp.prototype, {
            __value__: { value: r }
        });
    };
    _.RegExp.prototype = create(Kernel, {
        __class__: { value: 'RegExp' }
    });
    _.RegExp.prototype.learn(omitted(RP, [
        'constructor', 'toString', 'valueOf'
    ]));
    defineProperties(_.RegExp.prototype, {
        source: { get: function() { return this.value.source } },
        global: { get: function() { return this.value.global } },
        ignoreCase: { get: function() { return this.value.ignoreCase } },
        lastIndex: { get: function() { return this.value.ignoreCase } }
    });
    // Date - wrapped only opon request
    _.Date = function(d) {
        return create(_.Date.prototype, {
            __value__: { value: d }
        });
    };
    _.Date.prototype = create(Kernel, {
        __class__: { value: 'Date' }
    });
    _.Date.prototype.learn(omitted(DP, [
        'constructor', 'toString', 'valueOf', 'toJSON'
    ]));
    defineProperties(_.Date.prototype, {
        toJSON: {
            value: function(r, s) { return this.value.toJSON(r, s) }
        }
    });
    // Install!
    //   Should we use installproperty.js ?
    //   https://github.com/dankogai/js-installproperty
    defineProperty(Object, 'Wrap',
                   { value: _, configurable: true, wriable: true });
})(this);
