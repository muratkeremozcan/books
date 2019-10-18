const ninjaIslandMap = new Map(); // MAP CONSTRUCTOR to create a map
console.log(typeof ninjaIslandMap); // a map is of object type

const ninja1 = {name: "Yoshi"}; // 3 objects to use as KEYs
const ninja2 = {name: "Hattori"};
const ninja3 = {name: "Kuma"};

ninjaIslandMap.set(ninja1, { homeIsland: "Honshu"} ); // MAP.SET(KEY, {VALUE}) method for creating key-value pairs
ninjaIslandMap.set(ninja2, { homeIsland: "Hokkaido"} ); // map.set(key, {value})
ninjaIslandMap.set(ninja2, { homeIsland: "Bokkadio"} ); // KEY overwrites

console.log(ninjaIslandMap); // Map { {key => value}, {key => value} }
console.log(ninjaIslandMap.size); // MAP.SIZE method to get the map size...
console.log(ninjaIslandMap.has(ninja1)); // MAP.HAS(KEY)  to check if a map for a key Sexists
console.log(ninjaIslandMap.has(ninja2)); // map.has(key) to check if a map exists
console.log(ninjaIslandMap.has(ninja3)); // 3rd key-value pair has not been set, false

console.log(ninjaIslandMap.get(ninja1)); // MAP.GET(KEY) to get the value (obtain the mapping)
console.log(ninjaIslandMap.get(ninja2));
console.log(ninjaIslandMap.get(ninja3)); // no 3rd key-value pair, undefined

ninjaIslandMap.delete(ninja1); // MAP.DELETE(KEY)
console.log(ninjaIslandMap); // Map { {key => value}, {key => value} }
console.log(ninjaIslandMap.size); // MAP.SIZE method to get the map size...
console.log(ninjaIslandMap.has(ninja1)); // has been deleted
console.log(ninjaIslandMap.has(ninja2)); // MAP.HAS method: map.has(key)
console.log(ninjaIslandMap.has(ninja3)); // 3rd key-value pair has not been set, false

console.log(ninjaIslandMap.get(ninja1)); // has been deleted
console.log(ninjaIslandMap.get(ninja2));
console.log(ninjaIslandMap.get(ninja3)); // no 3rd key-value pair, undefined

console.log(ninjaIslandMap.size); // MAP.SIZE

ninjaIslandMap.clear(); // MAP.CLEAR()
console.log(ninjaIslandMap);
console.log(ninjaIslandMap.size);
console.log(ninjaIslandMap.has(ninja1)); // has been cleared
console.log(ninjaIslandMap.has(ninja2));
console.log(ninjaIslandMap.has(ninja3));

console.log(ninjaIslandMap.get(ninja1));
console.log(ninjaIslandMap.get(ninja2));
console.log(ninjaIslandMap.get(ninja3));

// https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373

// MAP (hashmap, hashtable, hash, dictonary) is a data type where data is stored in a form of pairs, which contains a unique key and value mapped to that key
// because of the uniqueness of each stored key, there is no duplicate pair stored.
// Map is mainly used for fast searching and looking up data
// key and value in Map can be in any data type, not limited to only STRING or INTEGER
/** DELTA of MAP vs js OBJECT:
 * Key field datatype: in MAP key datatype can be anything, in OBJECT key is limited to data types: string, integer, symbol
 * Order of Key-value pairs: order preserved in MAP, order not preserved in OBJECT
 * Accessing an element : we need to know the key in both. Access syntax is different : map.has vs object.id / object['id]
 * Checking if a key exists: syntax is different: map.has(x) vs  var isExist = 'id' in obj, Object.prototype.hasOwnProperty()
 * Adding syntax: map.set  vs obj.id=   , both in O(1) runtime
 * Delete syntax:  map.delete, map.clear   vs delete obj.id / obj.id = undefined (this leaves key btw). In order to achieve the same capability of clear(), Object will need to iterate through its properties (keys) and delete one by one until the end. 
 * getting size: easy with map.size  vs  Object.keys(obj).length calculated manually, with the help of Object.keys() — which returns an array of all existing keys in a certain object
 * ITERATION: map is built-in iterable, object is not. In Map all elements can be iterated directly with “for… of” or "forEach". In object we use for..in Or using Object.keys(obj) to get all the keys and iterate
 // WHY USE OBJECT? Object is the great choice for scenarios when we only need simple structure to store data and knew that all the keys are either strings or integers (or Symbol), because creating plain Object and accessing Object’s property with a specific key is much faster than creating a Map 
 // object property can equal to a function! In scenarios where there is a need to apply separate logic to individual property/element(s), then Object is definitely the choice
 * JSON has direct support for Object, but not with Map (yet)
 *
 * DELTA with JSON: JSON format is language independent, so it is not a term only limited to javascript as opposed to object literal.
 * he only noticeable difference is that all names in JSON must be wrapped in double quotes
 * to convert js object to a JSON, you can use JSON.stringify(obj)
 * to convert JSON to js object ‘data1’, you can use JSON.parse(data1)
// JSON data types
// JSON key must be strings
// JSON values can be : string, boolean, array, object, null


// YOU CAN CONVERT JSON TO MAP using Object.entries
// const map = new Map(Object.entries({foo: 'bar'}))
*/