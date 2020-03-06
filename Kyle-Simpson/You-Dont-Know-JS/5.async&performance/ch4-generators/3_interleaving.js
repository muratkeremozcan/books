var a = 1;
var b = 2;

function foor() {
  a++; //?
  b = b * a; //?
  a = b + 3; //?
  return [a, b]; //?
}

function barr() {
  b--; //?
  a = 8 + b; //?
  b = a * 2; //?
  return { a, b }; //?
}
// with normal JS functions, only two outcomes can occur. Switch the order to see.
foor(); //?
barr(); //?


/////////////////////
// with generators, clearly interleaving (even in the middle of statements!) is possible:
// You almost certainly won’t want to intentionally create this level of interleaving confusion, as it creates incredibly difficult to understand code.
// But the exercise is interesting and instructive to understand more about how multiple generators can run concurrently in the same shared scope, because there will be places where this capability is quite useful.

function* foo() {
  a++;
  a; //?
  b; //?
  yield; //?
  a; //?
  b; //?
  b = b * a;
  a; //?
  b; //?
  a = (yield b) + 3;
  a; //?
  b; //?
}

function *bar() {
  b--;
  yield;
  a; //?
  b; //?
  a = (yield 8) + b; //?
  b = a * (yield 2); //?
}

// helper to control the iterator
// initializes a generator to create its iterator
// returns a function which, when called, advances the iterator by one step.
function step(gen){
  // start the generator by creating iterator
  var it = gen(); //?
  // just an intializer, always undefined to begin with
  var last;
  
  return function() {
    last; //?
    // whatever is yielded out of the iterator this time, send it back to us the next time 
    // we pass back to generator with it.next(last), then we store this
    last = it.next(last).value; //?
  };
}
// reset a and b
a = 1;
b = 2;

var s1 = step(foo);
var s2 = step(bar);

s2(); // b-- , at first yield, last value iterator received is undefined
s2(); // yield 8 , last value that step received is 8
s1(); // a++, last value = undefined because nothing is yielded
s2(); // a = 8 + b (9), at yield 2
s1(); // b = b * a (9), at yield b
s1(); // a = b + 3
s2(); // b = a * 2

console.log(a, b);
