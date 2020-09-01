import { compose } from '../fp-tool-belt';
const sum = (x, y) => x + y;
const mult = (x, y) => x * y;

{ // want to do: 5 + (3 * 4)
  // saving 3*4 into a state with variable z, and then changing that state with z = 5 + z is a side effect
  let z = mult(3,4); //?
  z = sum(z, 5); //?
}

{ // how can we do it without side effects?
  // instead of assigning the result of mult(3,4) to a variable, just call it directly
  // this is called manual composition
  sum(mult(3,4), 5); //?

  // we can also create a utility function
  const multAndSum = (x,y,z) => sum(mult(x,y), z);
  multAndSum(3, 4, 5); //?
}

{ // with composition
  var multAndSum = compose2(mult, sum);
  
  multAndSum(3, 4, 5); //?

  function compose2 (fn1, fn2) {
    return function comp () {
      var args = [].slice.call(arguments);
      return fn2(
        fn1(args.shift(), args.shift()),
        args.shift()
      );
    }
  }
}