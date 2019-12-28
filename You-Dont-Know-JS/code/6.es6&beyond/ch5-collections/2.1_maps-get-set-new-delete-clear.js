// in JS objects are the primary mechanism for creating unordered key/value-pair data structures,
// However, the major drawback with objects-as-maps is the inability to use a non-string value as the key.
// Maps are key-value pairs where the key can be an object instead of just a string/ primitive.


var m = {},
    x = { id: 1 },
    y = { id: 2 };

m[x] = 'foo';
m[y] = 'bar';

// where is 'foo'? The two objects x and y both stringify to "[object Object]", so only that one key is being set in m.
m; //?
m[x]; //?
m[y]; //?


{ // pre ES6 fake map was O(n) complexity instead of O(1)
  // needed to maintain a parallel array of non-string keys alongside an array of the values,
  let keys = [], 
      vals = [];

  let x = {id: 1},
      y = {id: 2};

  keys.push(x);
  vals.push('foo');

  keys.push(y);
  vals.push('bar');


  keys[0] === x; //?
  keys[0]; //?
  vals[0]; //?

  keys[1] === y;//?
  keys[1]; //?
  vals[1]; //?
}


{ // ES6 maps solve this problem: keys be non-strings
  let esMap = new Map();

  let x = { id: 1 },
      y = { id: 2};
  
  // there is no more [ ] syntax for setting and retrieving values
  esMap.set(x, 'foo');
  esMap.set(y, 'bar');

  esMap; //?
  esMap.get(x); //?
  esMap.get(y); //?

  // to get the size 
  esMap.size; //?

  // 2 ways to copy a map
  let m2 = new Map(esMap.entries());
  m2; //?
  let m3 = new Map(esMap);  // shorter form is preferred
  m3; //?

  // instead of setting 1 by 1, you can manually specify an entries list (array of key/ value arrays) in the Map(..) constructor form:
  let m4 = new Map([
    [ x, 'foo'],
    [ y, 'bar']
  ]);
  m4; //?

  // to delete a key value pair (element)
  esMap.delete(x); //?
  esMap;

  // to clear the map
  esMap.clear();
  esMap; //?
}