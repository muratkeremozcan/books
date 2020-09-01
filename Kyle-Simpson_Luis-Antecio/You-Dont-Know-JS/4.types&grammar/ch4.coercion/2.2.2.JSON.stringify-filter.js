// toJSON() should be interpreted as “to a JSON-safe value suitable for stringification,” not “to a JSON string"

var a = {
  val: [1, 2, 3],
  // correct
  toJSON: function () {
    return this.val.slice(1); // JSON-safe for stringification
  }
};

JSON.stringify(a); //?

var b = {
  val: [1, 2, 3],
  // incorrect: stringified and returned the string 
  toJSON: function () {
    return '{' + this.val.slice(1).join() + '}'; // not a JSON string
  }
};

JSON.stringify(b); //?


// An optional second argument can be passed to JSON.stringify(..) that is called replacer. 
// This argument can either be an array or a function. 
// It’s used to customize the recursive serialization of an object by providing 
// a filtering mechanism for which properties should and should not be included, 
// in a similar way to how toJSON() can prepare a value for serialization. Useful when wanting to avoid circular references.

var a = {
  b: 42,
  c: '42',
  d: [1, 2, 3]
};

// include properties b and c, do not include d
JSON.stringify(a, ['b', 'c']); //?

// filter out property 'c'
JSON.stringify(a, function(k, v) {
  if (k !== 'c') { // if key is 'c', filter out property 'c'
    return v;
  }
}); //?

// a 3rd argument called space can be passed to JSON.stringify for indentation
// space can be a positive integer to indicate how many space characters should be used at each indentation level.
// Or, space can be a string, in which case up to the first 10 characters of its value will be used for each indentation level:
JSON.stringify(a, null, 3); //?
JSON.stringify(a, null, '-'); //?