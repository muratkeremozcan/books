// non-recursive way to sum numbers
function sumIter() {
  var sum = 0;
  for (let i = 0; i < arguments.length; i++) {
    sum = sum + arguments[i];
  }
  return sum;
}
sumIter(3, 4, 5); //?

// recursive way to sum numbers
function sumRecur (...args) {
	if (args.length <= 2) {
		return args[0] + args[1];
	}
  return ( 
    args[0] + 
    sumRecur(...args.slice(1)) 
  );
  // note: wrapping the return in ( ) is useful for multi-line expressions
}
sumRecur(3, 4, 5); //? 


{ // exercise : take mult and turn it into a recusive function that can work on as many arguments as necessary
  const multRecur = (...args) => { 
    if (args.length <=2 ) {
      return args[0] * args[1];
    }
    return args[0] * multRecur(...args.slice(1));
  }

  multRecur(3,4); //?
  multRecur(3,4,5); //?
}