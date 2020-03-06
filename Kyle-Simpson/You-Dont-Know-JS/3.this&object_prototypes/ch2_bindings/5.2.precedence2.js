// new > hard / explicit > implicit > default

// var bar = new foo()
// var bar = foo.call(obj2) , foo.apply(obj2) , foo.bind(obj2)
// var bar = obj1.foo()
// var bar = foo()

function foo(something) {
  this.a = something;
}

var obj1 = {
  foo: foo
};

var obj2 = {};

obj1.foo(2);
console.log(obj1.a);

obj1.foo.call(obj2, 3);
console.log(obj2.a);

// new binding > implicit binding
var bar = new obj1.foo(4);
console.log(obj1.a);
console.log(bar.a);

// new binding > explicit binding  for more nuanced reasons

/*
1. Is the function called with new (new binding)? If so, this is the newly constructed object.  
var bar = new foo() 

2. Is the function called with call or apply (explicit binding), even hidden inside a bind hard binding? 
If so, this is the explicitly specified object.  
var bar = foo.call( obj2 ) 

3. Is the function called with a context (implicit binding), otherwise known as an owning or containing object? \
If so, this is that context object.  
var bar = obj1.foo() 

4. Otherwise, default the this (default binding). 
If in strict mode, pick undefined, otherwise pick the global object.  
var bar = foo()

*/