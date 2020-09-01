// Imagine you’re passing a function to a utility, where the utility will send multiple arguments to that function,
// but you may only want the function to receive a single argument

export function unary(fn) {
  return function onlyOneArg(arg){
    return fn(arg);
  }
}

var unaryArrow = fn => arg => fn(arg);

/// uses of unary()
// ex: mapper function behaves incorrectly when passed-in too many arguments

// each time .map invokes the mapper function, it passes in three arguments: (value, idx, arr)
// For the signature parseInt(str, radix), when map(..) passes index in the second argument position, 
// it’s interpreted by parseInt(..) as the radix, which we don’t want.
['1','2','3'].map(parseInt); //?
// unary(..) creates a function that will ignore all but the first argument passed to it,
// meaning the passed-in index is never received by parseInt(..) and mistaken as the radix:
['1','2','3'].map(unary(parseInt)); //?
