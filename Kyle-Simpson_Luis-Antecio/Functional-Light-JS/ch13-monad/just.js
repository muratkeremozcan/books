import { map, flatMap, identity, curry, compose } from '../fp-tool-belt';

// In object-oriented programming, when you have a set of data (even a single discrete value)
//  and you have some behavior you want to bundle with it, you create an object/class to represent that “type”.
// Instances are then members of that type. This practice generally goes by the name “data structures”.

// A monad is a data structure. It’s a type. 
// It’s a set of behaviors that are specifically designed to make working with a value predictable.

// recall functor: a functor is a value that takes an associated value (ex: an array in map) and an operating function
// and executes the operating function for each associated value. Finally, returns a new array with all the newly mapped values in it.
// map is a functor, foEach is not.
// A Monad is a functor that includes some additional behavior


// A basic primitive monad underlying many other monads you will run across is called Just. 
// It’s just a simple monadic wrapper for any regular (aka, non-empty) value.
// All monad instances will have map(..), chain(..) (also called bind(..) or flatMap(..)), and ap(..) methods.

function Just(val) { // notice that val is never changed
  return { map, chain, ap, inspect };
  // ********************* 
  function map(fn) {
    return Just(fn(val));
  }
  function chain(fn) { // aka: bind, flatMap 
    return fn(val);
  }
  function ap(anotherMonad) {
    return anotherMonad.map(val);
  }
  function inspect() { // included for demo purposes
    return `Just(${val})`;
  }
}

////////////
// map
// just like an array map, a monad’s map(..) calls a mapper function with the monad’s value
// in addition to map,  whatever is returned is wrapped in a new Just monad instance:
var A = Just(10); //?
A.map(v => v * 2); //?


////////////
// chain
// chain does the same thing as map, in addition it unwraps (flattens) the resulting value from its new monad 
// the result here is a primitive value, not a monad holding that value
A.chain(v => v + 1); //?
// a chain calls identity with the value in A : Just(10) -> 10
A.chain(identity); //?

// recall map and flatMap. Same thing is happening with monad's chain
var x = [3];
map(v => [v, v + 1], x); //?
flatMap(v => [v, v + 1], x); //?


////////// 
// ap
// ap(..) takes the value wrapped in a monad and “applies” it to another monad using that other monad’s map(..).

// how could we make a monad with A and B are added together?
var B = Just(3); //?
const sum = (x, y) => x + y; // this, with monads A + B

// To use ap(..), we first need to construct a monad that holds a function, that itself remembers via closure the value in A.
// to make a monad from A that holds a value-containing function, we call A.map
// then we give it a curried function that remembers that extracted value as its first argument
var C = A.map(curry(sum)); //?

// The curried sum(..) function is expecting two values to do its work, 
// and we give it the first of those values by having A.map(..) extract 10 and pass it in. 
// C now holds the function that remembers 10 via closure

// now we can get the second value (3 inside B) passed to the waiting curried function in C
var D = C.ap(B); //?
// The value 10 came out of C, and 3 came out of B, and sum(..) added them together to 13 and wrapped that in the monad D.

// summary
A.map(curry(sum)).ap(B); //?
// to illustrate what ap is helping with, we can achieve the same result this way
B.map(A.chain(curry(sum))); //?
// that is just a composition
compose(B.map, A.chain, curry)(sum); //?