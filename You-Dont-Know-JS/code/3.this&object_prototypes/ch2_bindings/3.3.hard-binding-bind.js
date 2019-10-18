// (binding rule 3) since hard binding is common, now the 'in' way is to use bind
// the main difference in bind vs apply is that bind returns a value and has to be called with ()


function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

// ES5 function.prototype.bind
var bar = foo.bind(obj);

var b = bar(3); // 2 3
b//?

// call, apply, bind all invoke the method with specified 'this' context, with passed in parameter(s)
// 
// call(..) and apply(..) are similar: they  behave differently with their additional parameters,
// In call the subsequent arguments are passed in to the function as they are, 
// while apply expects the second argument to be an array that it unpacks as arguments for the called function
// apply is useful when the arguments are not known
//
// functionName.call(objContext, <optional args>)
// functionName.apply(objContext, [<optional args>])
// functionName.bind(objContext, [args]) ()
//
// bind works by returning a copy of the function, while using apply. (have a look at bind helper)
// It is for future use. It needs to be executed with ()
//////

let obj10 = { things: 10 };

let addThings = function (a, b, c) {
  return this.things + a + b + c;
};


console.log(addThings.apply(obj10, [1,4,6])   );
console.log( addThings.bind(obj10, 1, 4, 6)() );


///////
// many libraries have a workaround for not having to use bind, ex: forEach

function foof(el) {
  console.log(el, this.id);
}

var obj = {
  id: "awesome"
};

// forEach can also specify which context to execute the function in, in this case 'obj' context
[1, 2, 3].forEach(foof, obj);
// Internally, these various functions use explicit binding via call(..) or apply(..), saving you the trouble