/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

var asStr = function(o){ 
    return o === null || o === void(0) ? '' + o
        :  typeof(o) === 'function' ? '(' + o  + ')' : JSON.stringify(o) 
};
var nullish = {isUndefined:undefined, isNull:null};
var falsy   = {isBoolean:false, isNumber:0, isString:''};
var empty   = {isArray:[], isFunction:function(){}, isObject:{}};

describe('Type Checkers', function() {
    var isType = {};
    Object.extend(isType, falsy);
    Object.extend(isType, empty);
    Object.keys(isType).forEach(function(k){
        var v = isType[k];
        var cls = k.substr(2);
        var typ = cls === 'Array' ? 'object' : cls.toLowerCase();
        it(asStr(v) + '.typeOf() === ' + asStr(typ),
           eq(v.typeOf(), typ));
        it(asStr(v) + '.classOf() === ' + asStr(cls),
           eq(v.classOf(), cls));
        var isNil = v === null || v === undefined;
        it(asStr(v) + '.isNil() === ' + isNil,
           eq(v.isNil(), isNil));
        var isPrimitive = Object(v) !== v;
        it(asStr(v) + '.isPrimitive() === ' + isNil,
           eq(v.isPrimitive(), isPrimitive));
        Object.keys(isType).forEach(function(k2){
            it(asStr(v) + '.' + k2 + '() === ' + (k === k2),
               eq(v[k2](), k === k2));
        });
    });
    Object.extend(isType, nullish);
    Object.keys(isType).forEach(function(k){
        var v = isType[k];
        var cls = k.substr(2);
        var typ = cls === 'Array' ? 'object' : cls.toLowerCase();
        it('Object.typeOf(' + asStr(v) + ') === ' + asStr(typ),
           eq(Object.typeOf(v), typ));
        it('Object.classOf(' + asStr(v) + ') === ' + asStr(cls),
           eq(Object.classOf(v), cls));
        var isNil = v === null || v === undefined;
        it('Object.isNil(' + asStr(v) + ') === ' + isNil,
           eq(Object.isNil(v), isNil));
        var isPrimitive = Object(v) !== v;
        it('Object.isPrimitive(' + asStr(v) + ') === ' + isNil,
           eq(Object.isPrimitive(v), isPrimitive));
        Object.keys(isType).forEach(function(k2){
            var pred = k === k2
            || (k == 'isObject' && Object(isType[k2]) === isType[k2]);
            it('Object.' + k + '(' + asStr(isType[k2]) + ') === ' + pred,
               eq(Object[k](isType[k2]), pred));
        });
    });
});
