// if an object has its own toString() method on it, and you use that object in a string-like way, 
  // its toString() will automatically be called, and the string result of that call will be used instead

var a = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;
typeof a; //?
var c = a + '';
typeof c; //?
a.toString(); //?
typeof a.toString(); //?


// Arrays have an overridden default toString() that stringifies as the (string) concatenation of all its values 
  // (each stringified themselves), with "," in between each value:
var b = [1,2,3];
b.toString(); //?
typeof b.toString(); //?