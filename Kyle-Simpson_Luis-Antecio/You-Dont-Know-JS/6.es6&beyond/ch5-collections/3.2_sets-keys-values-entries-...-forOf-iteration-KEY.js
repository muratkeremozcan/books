// Sets have the same iterator methods as maps.


var s = new Set();

var x = {id: 1},
    y = {id: 2};

s.add(x).add(y);

s; //?
s.keys(); //?
s.values(); //?
s.entries(); //?

// pay attention to how keys and values are the same: they yield a list of unique values
var keys = [ ...s.keys() ]; //?
var vals = [ ...s.values() ]; //?
// and how entries are repeated: yields a list of entry arrays, where both items of the array are the unique set value.
var entries = [ ...s.entries() ]; //?
// default iterator for a set is its values() iterator, in contrast to maps where the default iterator is the entries
var defaultIterator = [ ...s ]; //?

keys[0] === x; //?
keys[1] === x; //?
vals[0] === x; //?
vals[1] === y; //?
defaultIterator[0] === x; //?
defaultIterator[1] === x; //?

entries[0][0] === x; //?
entries[0][1] === x; //?
entries[1][0] === y; //?
entries[1][1] === y; //?


// uniqueness of a set is a useful trait. Here's how you manually specify a set:
var s1 = new Set ( [1,2,3,4,'1',2,4,'5']);
var uniques = [ ...s1 ];
// Set uniqueness does not allow coercion, so 1 and "1" are considered distinct values.
uniques