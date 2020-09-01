// In the case of new.target, the keyword new serves as the context for a property access.
// This is a clear example of a meta programming operation, 
// as the intent is to determine from inside a constructor call what the original new target was,

/** change the behavior of constructor if it is invoked via child class*/
class Parent {
  constructor() {
    if (new.target === Parent) {
      console.log('Parent instantiated');
    } 
    else {
      console.log('A child instantiated');
    }
  }
}

class Child extends Parent {/* */}
var a = new Parent(); 
var b = new Child();