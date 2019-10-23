// messages can go in both directions
// yield .. as an expression can send out messages in response to next(..) calls, 
// and next(..) can send values to a paused yield expression
// yield .. and next(..) pair together as a two-way message passing system during the execution of the generator.


function *foo(x) {
  x; //?
  var y = x * (yield 'Hello');
  x; //?
  y; //?
  return y;
}

var it = foo(6); //?

// the next() call started the generator and the generator yielded a value 
// also, mind that the next() call did not pass anything back to the generator (as in the previous example)
var res = it.next(); //?
res.value; //?

// at this state, the generator is still waiting for a value to be passed to it

// now we pass a value back to the generator via next(<value>)
res = it.next(7); //?
res.value; //?


// IMPORTANT: We don’t pass a value to the first next() call, and that’s on purpose. 
// Only a paused yield could accept such a value passed by a next(..), 
// and at the beginning of the generator when we call the first next(), there is no paused yield to accept such a value.
