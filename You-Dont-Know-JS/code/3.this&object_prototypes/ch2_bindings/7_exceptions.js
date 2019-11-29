// if you pass in null or undefined as this binding to call, apply or bind, those values are ignored and default binding is used

function foo (a,b) {
  console.log('a' + a + 'b' + b);
}

// null can create side effects in 3rd party libraries that may use 'this' 
// you can use a true safe null object 
// var ø = Object.create( null );


// It’s common to use apply(..) for spreading out arrays of values as parameters to a function call.
foo.apply(null, [5, 6]);

// Similarly, bind(..) can curry parameters (preset values)
var bar = foo.bind(null, 7);
bar(3);

// Both these utilities require a this binding for the first parameter. 
// If the functions in question don’t care about this, you need a placeholder value, and null might seem like a reasonable choice 


// ES6 has the spread operator that can be used instead of apply
foo(...[6,7])