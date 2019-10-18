var assert = require('assert');

var store = {
  nextId: 1,  // nextId property stores the next available id
  cache: {},  // cache property caches the stored functions
  add: function(fn) { // add function to cache, if it is unique
    if(!fn.id) {  // only if function id does not exist
      fn.id = store.nextId++; // store store function id and increment id  for later
      store.cache[fn.id] = fn; // in cache assign the function id, set the value to the function being added
      return true;
    }
  }
};
function ninja() {}
function turtle() {}
function teenage(){}

assert(store.add(ninja), 'condition is true, do nothing');
assert(!store.add(ninja), 'function not added another time')
assert(!store.add(ninja), 'function not added another time');
assert(!store.add(ninja), 'function not added another time');
assert(store.add(turtle), 'condition is true, do nothing');
assert(store.add(teenage), 'condition is true, do nothing');
console.log(store);

