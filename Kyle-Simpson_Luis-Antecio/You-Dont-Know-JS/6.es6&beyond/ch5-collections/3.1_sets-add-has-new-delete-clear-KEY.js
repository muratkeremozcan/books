// A set is a collection of unique values (duplicates are ignored). 
// The API for a set is similar to map. The add(..) method takes the place of the set(..) method and there is no get(..) method.
// A set doesn’t need a get(..) because you don’t retrieve a value from a set, but rather test if it is present or not, using has(..):


var s = new Set();

var x = {id: 1},
    y = {id: 2};

s.add(x);
s.add(x);
s.add(y);

s.size; //?
s.delete(y); //?
s; //?
s.clear();
s.size; //?

// The Set(..) constructor form is similar to Map(..), it can receive an iterable, like another set or simply an array of values.
// However, unlike how Map(..) expects an entries list (array of key/ value arrays), Set(..) expects a values list (array of values)

var s1 = new Set( [ x, y ] );
var m1 = new Map( [ [x, 'foo'], [y, 'bar'] ]);

s1.has(x); //?
s1.has(y); //?