// One of the most common meta programming tasks is to introspect on a value to find out what kind it is,
// usually to decide what operations are appropriate to perform on it.
// With objects, the two most common inspection techniques are toString() and instanceof

function Foo() {/** */}; 

var a = new Foo();

a.toString(); //?
a instanceof Foo; //?

// in ES6 you can control the behavior of toString() and instanceof

function Foo(greeting) {
  this.greeting = greeting;
}
// re-define toString()
Foo.prototype[Symbol.toString] = 'Foo';
// re-define instanceof: to set @@ hasInstance on a function, you must use Object.defineProperty(..), 
// as the default one on Function.prototype is writable: false.
Object.defineProperty(Foo, Symbol.hasInstance, {
  value: function(inst) {
    return inst.greeting == 'hello';
  }
});


var a = new Foo('hello');
var b = new Foo('world');

b[Symbol.toStringTag] = 'cool';

a.toString(); //?
b.toString(); //?

a instanceof Foo; //?
b instanceof Foo; //?
