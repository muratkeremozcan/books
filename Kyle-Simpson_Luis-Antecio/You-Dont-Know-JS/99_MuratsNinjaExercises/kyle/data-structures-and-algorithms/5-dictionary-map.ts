// Map, dictionary, hash table, hash map
// /books/Kyle-Simpson_Luis-Antecio/You-Dont-Know-JS/6.es6&beyond/ch5-collections/2.1_maps-get-set-new-delete-clear-KEY.js
// https://medium.com/front-end-weekly/es6-map-vs-object-what-and-when-b80621932373

// in JS you can use an object or Map
// Map: unique elements, ordered, keys & values can be any kind of data (imagine a 2 dimensional array)
// Object: can have duplication, unordered, a key can only be a string, number, or symbol

const obj = { id: 1, name: "test object", 2: 3, lastName: undefined };

obj.lastName = "Ozcan";
obj; //?
Object.keys(obj).length; //?
delete obj.lastName;
obj; //?

// can access string keys with dot notation
obj.id; //?
obj["name"]; //?
// have to access numbers with array notation
obj[2]; //?
// obj.2; //? won't work

// map
const map = new Map([
  [1, 2],
  [3, 4],
]);

map.set(5, 6);
map.set("foo", "bar");

map; //?
const foo = map.get(7); //?
const has3 = map.has(3); //?
const delete4 = map.delete(4); //?
map; //?
map.size; //?
map.clear(); //?
map; //?
