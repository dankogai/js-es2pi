/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../es2pi.js');
}

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
});
