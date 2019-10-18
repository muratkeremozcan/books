// an array can include a number, string, array or object
var a = [ 1, '2', [3], {b: 4}]; 
a.length; //?
a[2][0]; //?
a[3].b;//?

// careful with empty slots using delete 
a[1] = undefined;
a//?
a.length; //?

// if a string value is passed in and it can be coerced as a number, it is assumed as a number index
var b = [];
b['13'] = 42;
b;//?
b.length; //?


// conversion: array-like to array using SLICE

function foo(){
  // If slice() is called without any other parameters, the default values for its parameters have the effect of duplicating the array
  // var arr = Array.prototype.slice.call( arguments );
  // ES6 version
  var arr = Array.from(arguments);
  // arr.push('bam');
  console.log( arr );
}
foo('bar', 'baz');
