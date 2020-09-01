// Organizing code so that each function receives another function to execute at its end 
// is referred to as Continuation Passing Style (CPS)

import { identity } from '../fp-tool-belt';


// classic fibonacci has 2 recursive calls, which is not PTC
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 2) + fibonacci(n - 1);
}

fibonacci(5); //?


// To apply CPS to fibonacci, you can perform the first recursive call, 
// and wrap the subsequent recursive calls in a continuation function to pass into that first call.
function fib(n, cont = identity) {
  if (n <= 1) return cont(n);
  return fib(n - 2, n2 => 
    fib(n - 1, n1 => 
      cont(n2 + n1)
    )
  )
}

fib(5); //?
// two continuation functions are added to the mix. 
// The first one receives the n2 argument, which eventually receives the computation of the fib(n-2) value. 
// The next inner continuation receives the n1 argument, which eventually is the fib(n-1) value. 
// Once both n2 and n1 values are known, they can be added together (n2 + n1), 
// and that value is passed along to the next cont(..) continuation step.
