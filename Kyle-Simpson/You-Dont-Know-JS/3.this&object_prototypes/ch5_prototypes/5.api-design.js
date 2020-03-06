var anotherObject = {
  cool: function() {
    console.log('cool!');
  }
}

// with Object.create , myObject is prototype-chain-linked to the prototype object (anotherObject)
// The property access process continues until either a matching property name is found up in the prototype chain, or the [[Prototype]] chain ends. 
// If no matching property is ever found by the end of the chain, the return result from the [[Get]] operation is undefined.
// The top end of every normal [[Prototype]] chain is the built-in Object.prototype.
var myObject = Object.create(anotherObject);

// check out myObject is empty! but can property delegate cool function
anotherObject; //?
myObject; //?
myObject.cool; //?

// create a clear api
myObject.doCool = function() {
  // 'this' refers to myObject
  this.cool();
}

// internal delegation to make the api clearer
myObject.doCool();

// OLOO property delegation
myObject.cool(); 