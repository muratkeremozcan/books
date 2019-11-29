function identify() {
  return this.name.toUpperCase();
}

function speak() {
  var greeting = 'Hello I am ' + identify.call(this);
  return greeting;
}

var me = {
  name : 'Murat'
};

var you = {
  name: 'Reader'
};

// call invokes the method with specified 'this' context, with passed in parameter(s)
identify.call(me); //?
identify.call(you); //?

speak.call(me); //?
speak.call(you); //?

// this is neither a reference to the function itself, nor is it a reference to the function’s lexical scope. 
// this is actually a binding that is made when a function is invoked, 
// and what it references is determined entirely by the call-site where the function is called.

//// 

// to understand what this points to, you have to examine how the function in question was called. 
// It will be one of these four ways, and that will then answer what this is.

function foo() {
  console.log( this.bar );
}

var bar = "global";

var obj1 = {
  bar: "obj1",
  foo
};

var obj2 = {
  bar: "obj2"
};

foo();              // "global" in non-strict mode, undefined in strict mode
obj1.foo();         // "obj1" , sets this to obj1 . Implicit binding. Careful when assigning to a variable or passing it in as a an argument to a function!
foo.call( obj1 );   // 'obj1" , obj1 specified as this context . There is also apply and bind and arrow function
var c = new foo();  // with new, a new object is constructed and the scope of 'this' is set as the new object (undefined here because of global scope,)
