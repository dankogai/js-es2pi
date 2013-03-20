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

    describe('Object', function () {
        var specA = Object.getOwnPropertyDescriptor(Object, 'freeze'),
        specB = Object.getOwnPropertyDescriptor(Object, 'extend');
        ['configurable', 'enumerable', 'writable'].forEach(function(p){
            it(p+'==='+specA[p], eq(specA[p], specB[p]))
        });
        it('Object.extend', eq_deeply(
            Object.extend({name : 'moe'}, {age : 50}), 
            {name:"moe",age:50}
        ));
        it('Object.defaults', eq_deeply(
            Object.defaults(
                {flavor : "chocolate"}, 
                {flavor : "vanilla", sprinkles : "lots"}
            ),
            {flavor : "chocolate", sprinkles : "lots"}
        ));
        it('Object.items', eq_deeply(
            Object.items(
                {one : 1, two : 2, three : 3}
            ),
            [["one", 1], ["two", 2], ["three", 3]]
        ));
        it('Object.values', eq_deeply(
            Object.values(
                {one : 1, two : 2, three : 3}
            ),
            [1,2,3]
        ));
        
        it('Object.has({})', eq(Object.has({}, ''), false));
        it('Object.has({1:1})', eq(Object.has({1:1}, '1'), true));
        it('Object.has({hasOwnProperty:false})', 
           eq(Object.has({hasOwnProperty:true}, 'hasOwnProperty'), true));
        it('Object.has(Object.create({hasOwnProperty:false}))', 
           eq(Object.has(Object.create({hasOwnProperty:true}), 
                         'hasOwnProperty'), 
              false));
        var o = {};
        it('Object.set({},"x", 1) === undefined', 
           eq(Object.set(o, 'x', 1), undefined));
        it('Object.get({x:1},"x") === 1', eq(Object.get(o, 'x'), 1));
        it('Object.get({x:1},"hasOwnProperty") === undefined', 
           eq(Object.get(o, 'hasOwnProperty'), undefined));
        // custom object
        var Point = function(x, y) {
            if (!(this instanceof Point)) return new Point(x, y);
            this.x = x*1;
            this.y = y*1;
        };
        Point.prototype = {
            distance: function(pt) {
                if (!pt) pt = Point(0,0);
                var dx = this.x - pt.x;
                var dy = this.y - pt.y;
                return Math.sqrt(dx*dx + dy*dy);
            }
        };
        var pt = Point(3,4),
        pt2 = Object.map(pt, function(v){ return v*2 }); // Point(6,8)       
        it('Object.map', eq(pt2.distance(), 10));
        it('Object.filter', eq_deeply(
            Object.filter(pt, function(v, k) { return k === 'x' }),
            {x:3}
        ));
        var isEven = function(v, k) {  return v % 2 === 0 };
        var isOdd  = function(v, k) {  return v % 2 === 1 };
        it('Object.some', ok(
            Object.some(pt, isOdd) && !Object.some(pt2, isOdd)
        ));
        it('Object.every', ok(
            !Object.every(pt, isEven) && Object.every(pt2, isEven)
        ));
    });

})(this);
