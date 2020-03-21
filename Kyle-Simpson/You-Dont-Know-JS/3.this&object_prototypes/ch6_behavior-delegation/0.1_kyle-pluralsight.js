// OOLO - prototype linkages

function Foo(who) {
  this.me = who;
}
// function FOO has a Prototype identify. 
Foo.prototype.identify = function() {
  return 'I am ' + this.me;
}

// class orientation likes parent+child classes that have same method names. 
// Object linked to Objects likes to delegate up and have 1 function
// use different prototype names instead of shadowing function names, so 'this' always references the variable
Foo.prototype.speak = function() {
  console.log('Hello ' + this.identify());
}


var a1 = new Foo('a1'); // this reference is set to a1
var a2 = new Foo('a2'); // this reference is set to a2
// think of constructor just an arbitrary word, it's just a property
a1.constructor; //?
a2.constructor; //?


// a1 calls the delegated identify from its __proto__
a1.identify(); //?
// a1 calls its __proto__
a1.speak();

a1.__proto__; //?
Object.getPrototypeOf(a1); //?


// a2 can have its own speak function which doesn't need to be delegated up the proto chain
a2.speak = function() {
  console.log('Hell no ' + this.identify());
}
// a2 calls the delegated identify from its __proto__
a2.identify(); //?
// a2 calls its own speak function which doesn't need to be delegated up the proto chain'
a2.speak();

a2.__proto__; //?
Object.getPrototypeOf(a2); //?
// hacky way: get the top Function (Foo) and then get its pr
a2.constructor.prototype; //?



