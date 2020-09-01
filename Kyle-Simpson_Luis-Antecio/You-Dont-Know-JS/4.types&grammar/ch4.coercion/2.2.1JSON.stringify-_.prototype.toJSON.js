// JSON.stringify
// behaves like toString()
JSON.stringify(42); //?
typeof (JSON.stringify(42)); //?
// except that the result is always a string, wrapped in " "
JSON.stringify('42'); //?
typeof (JSON.stringify('42')); //?
('42').toString(); //?
typeof ('42'); //?

// exceptions are non-safe JSON values: undefined, function, ES6 symbol, objects with circular references
// The JSON.stringify(..) utility will automatically omit undefined, function, and symbol values when it comes across them.
JSON.stringify(undefined); //?
JSON.stringify(function(){}); //?
// If such a value is found in an array, that value is replaced by null
JSON.stringify([1, undefined, function(){}, 4]); //?
// if it's in an object, it's ignored
JSON.stringify({b: function(){}, a: 3 }); //?

// If you intend to JSON stringify an object that may contain illegal JSON value(s), 
  // or if you just have values in the object that aren’t appropriate for the serialization, 
  // you should define a toJSON() method for it that returns a JSON-safe version of the object. 
  // (or use lodash https://lodash.com/docs/4.17.15#prototype-value  _.prototype.toJSON  _.prototype.value
var o = {};
var a = {
  b: 42,
  c: o,
  d: function(){}
};
// create a circular reference inside a
o.e = a;
// JSON.stringify(a); // throws error on the circular reference
// define a custom JSON value serialization
  // JSON stringification has the special behavior that if an object value has a toJSON() method defined, this method will be called first to get a value to use for serialization.
a.toJSON = function() {
  return { b: this.b };
};
a.toJSON(); //?
JSON.stringify(a); //?
// toJSON returns the actual regular value, and JSON.stringify handles the stringification

typeof a.toJSON(); //?
typeof (JSON.stringify(a)); //?

