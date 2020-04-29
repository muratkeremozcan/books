// You can’t avoid mutations or fix the problem with side effects, 
// but you can at least work with IO operations as if they were immutable from the application point of view.
// This can be done by lifting IO operations into monadic chains and letting the monad drive the flow of data.

// IO monad  wraps an effect function instead of a value; remember, a function can be thought of as a lazy value, waiting to be computed. 
// With this monad, you can chain together any DOM operations to be executed in a single “pseudo” referentially transparent operation 
// and ensure that side effect–causing functions don’t run out of order or between calls.
