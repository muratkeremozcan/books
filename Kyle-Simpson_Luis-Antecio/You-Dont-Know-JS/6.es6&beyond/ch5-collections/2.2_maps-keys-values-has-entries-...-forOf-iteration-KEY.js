// To get the list of values from a map, use values(), which returns an iterator.
// recall the impact of ... and for of loops, Array.from on processing iterators

let m = new Map();
let x = { id: 1 },
    y = { id: 2 };

m.set(x, 'foo');
m.set(y, 'bar');

// maps have iterators: keys, values, entries
m; //?
m.keys(); //?
m.values(); //?
m.entries(); //? 

let keys = [ ...m.keys() ]; //?
let vals = [ ...m.values() ]; //?
// you can iterate over a map’s entries using entries(), or the default iterator
let entries = [ ...m.entries() ]; //?
let defaultIterator = [...m]; //?

// to determine if a map has a given key
m.has(x); //?



Array.from(m.values()); //?


// for of returns the values, not the indices/keys like for in. PREFERRED with ARRAYs. Does not work with Objects because objects are not iterable with [Symbol.iterator]
  // for of is like a forEach that returns values. It is usable with arrays as well as anything iterable
for (let v of m.values()) {
  v; //?
}


// try hard trivia
Array.from(m.values()).forEach(function(v) {
  v; 
})