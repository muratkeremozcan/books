// Sometimes it will be helpful to assign the [[ Prototype]] of an object at the same time you’re declaring its object literal.
var o1 = {
  'a' : 'mama'
}

// o2 is declared with a normal object literal, but it’s also [[ Prototype]]-linked to o1.
var o2 = {
  __proto__: o1
};
o2.__proto__; //?

// __proto__ here is being used as a key in an object literal definition. it can also be used in object property form like o.__proto__
// __proto__ is both a getter and setter and is controversial
// instead, for setting prototype of an object you can use Object.setPrototypeOf( o2, o1 )

var o3 = {
  'd' : 'dada'
}
Object.setPrototypeOf(o3, o1);
Object.getPrototypeOf(o3); //?
// controversial:
o3.__proto__; //?
