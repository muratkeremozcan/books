// If a function has a this reference inside it, that this reference usually points to an object. 
// But which object it points to depends on how the function was called.

function foo() {
  console.log( this.bar );
}

var bar = "global";

var obj1 = {
  bar: "obj1",
  foo: foo
};

var obj2 = {
  bar: "obj2"
};

// --------
// to understand what this points to, you have to examine how the function in question was called. 
// It will be one of these four ways, and that will then answer what this is.

foo();              // "global" in non-strict mode, undefined in strict mode
obj1.foo();         // "obj1" , sets this to obj1
foo.call( obj1 );   // 'obj1
foo.call( obj2 );   // "obj2" , sets this to obj2
new foo();          // undefined, sets this to a new object