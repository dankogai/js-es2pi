/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

Function.prototype.toJSON = function(){ return '(' + this + ')' };
Date.prototype.toJSON = function(){ return '(new Date(' + this*1 + '))' };
RegExp.prototype.toJSON = function(){ return ''+this };
var asStr = function(o){ 
    if (o === null || o === void(0)) return '' + o;
    var jstr = JSON.stringify(o);
    return typeof o !== 'string' 
        ? jstr.replace(/^\"/,'').replace(/\"$/,'') : jstr;
};
var nullish = {isUndefined:undefined, isNull:null};
var falsy   = {isBoolean:false, isNumber:0, isString:''};
var empty   = {isArray:[], isFunction:function(){}, isObject:{}};
var misc    = {isRegExp:/(?:)/, isDate:(new Date(0))};
var agmts   = {isArguments:(function(){ return arguments})('arguments')};
var c2t     = {
    Arguments:'object',Array:'object',Date:'object',RegExp:'object'
};
describe('Type Checkers', function() {
    var isType = {};
    Object.extend(isType, falsy);
    Object.extend(isType, empty);
    Object.extend(isType, misc);
    Object.keys(isType).forEach(function(k){
        var v = isType[k];
        var cls = k.substr(2);
        var typ = c2t[cls] || cls.toLowerCase();
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
            var pred = k === k2 || (k2 === 'isObject' && Object(v) === v);
            it(asStr(v) + '.' + k2 + '() === ' + pred,
               eq(v[k2](), pred));
            if (k === 'isObject') return;
            pred = k === k2;
            var expr = cls + '.' + k + '(' + asStr(isType[k2]) + ')';
            //console.log(expr + ' === ' + pred);
            it(expr + ' === ' + pred, eq(eval(expr), pred));
        });
    });
    Object.extend(isType, nullish);
    Object.extend(isType, agmts);
    Object.keys(isType).forEach(function(k){
        var v = isType[k];
        var cls = k.substr(2);
        var typ = c2t[cls] || cls.toLowerCase();
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
            var v2 = isType[k2],
            pred = k === k2 || (k === 'isObject' && Object(v2) === v2);
            it('Object.' + k + '(' + asStr(v2) + ') === ' + pred,
               eq(Object[k](v2), pred));
        });
    });
});
