var assert = require('assert');

var greet = name => "Greetings " + name; // if there is 1 parameter, ( ) are optional. If the return statement is on 1 line, you can drop the 'return' and the { }

var anotherGreet = function(name) {
  return "Greetings " + name;
};

console.log(greet("Oishi"));
console.log(anotherGreet("Oishi"));

assert(greet("Oishi") === "Greetings Oishi", console.log("Oishi is properly greeted"));
assert(anotherGreet("Oishi") === "Greetings Oishi", console.log("Again, Oishi is properly greeted"));