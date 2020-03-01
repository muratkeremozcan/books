// In trampolines CPS-like continuations are created, but instead of passed in, they are shallowly returned.

function trampoline(fn) {
  return function trampolined(...args) {
    var result = fn(...args);
    args
    // As long as a function is returned, the loop keeps going, executing that function and capturing its return, then checking its type.
    while (typeof result == 'function') {
      result = result();
    }
    return result;
  }
}

var sum = trampoline(
  function sum(num1, num2, ...nums) {
    num1 = num1 + num2;
    if (nums.length == 0) return num1;
    return () => sum(num1, ...nums);
  }
)

sum(1, 2); //?
let xs = [];
for(let i=0; i<20000; i++) {
  xs.push(i)
}
sum(...xs); //?

// Beyond execution and memory performance, the advantage of trampolines over CPS is that they’re less intrusive on the declarative recursion form, 
//in that you don’t have to change the function signature to receive a continuation function argument.
// Trampolines are not ideal, but they can be effective in your balancing act between imperative looping code and declarative recursion.
