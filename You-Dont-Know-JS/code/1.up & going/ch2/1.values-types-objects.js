// JS types 
// boolean  number  string  null  undefined  object  symbol (new to ES6)

// Variables that have no value currently actually have the undefined value
var a;
typeof a; //?


a = true;
typeof a; //?

a = 42;
typeof a; //? 

a = "hello world";
typeof a;	//?

a = undefined;
typeof a; //?	

a = null;
typeof a;	//?

a = { b: "c" };
typeof a; //?	

typeof function z(b, c) {/*..*/} === 'function' //?
// It’s easy to think that function would be a top-level built-in type in JS, especially given this behavior of the typeof operator. 
  // However, if you read the spec, you’ll see it’s actually somewhat of a “subtype” of object. 
  // Specifically, a function is referred to as a “callable object” 
  // an object that has an internal [[Call]] property that allows it to be invoked.
  
// arrays are a as a “subtype” of object with the additional characteristics of being numerically indexed 
  // (as opposed to just being string-keyed like plain objects)
typeof[1, 2, 3]; //?

// new in ES6
typeof Symbol() //?


// in JavaScript, variables don’t have types — values have types.
  // If you use typeof against a variable, it’s not asking “What’s the type of the variable?”
  // Instead, it’s asking “What’s the type of the value in the variable?”

var a = 42;
typeof a; //?
a = true; 
typeof a; //?


/// 

// Properties can either be accessed with dot notation (i.e., obj.a) or bracket notation (i.e., obj["a"]). Dot notation is shorter and generally easier to read, and is thus preferred when possible. 
// Bracket notation is useful if you have a property name that has special characters in it, like obj["hello world!"] — such properties are often referred to as keys when accessed via bracket notation.

var obj = {
  a: 'hello world',
  b: 42
}

var b = 'a';
obj[b] //?

obj.a //?
obj.b //? 
obj['a'] //?
obj['b'] //?

/// 
var a = [1, 2, 3] //?
var b = [1, 2, 3] //?
var c = '1,2,3';
a == c; //?
b == c; //?
a == b; //?
// this last one compares if the arrays are the same array object in memory, therefore it fails

// how do you check for array equality?
