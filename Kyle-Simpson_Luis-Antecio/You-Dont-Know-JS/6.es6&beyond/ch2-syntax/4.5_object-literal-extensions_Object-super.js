// due to JS’ classless-objects-with-prototypes nature, super is nearly the same in behavior as the object's concise methods


var o1 = {
  foo() {
    console.log('o1:foo');
  }
}

var o2 = {
  bar() {
    super.foo();
    console.log('o2:bar');
  }
}

Object.setPrototypeOf(o2, o1);
// because of super, when calling bar, foo also gets called
o2.bar(); //?

// super.foo() reference in bar() is basically like Objet.getPrototypeOf(o2)
Object.getPrototypeOf(o2); //?
// HOWEVER super is only allowed in concise methods, not regular function expression properties
// super.foo(); // will not work
