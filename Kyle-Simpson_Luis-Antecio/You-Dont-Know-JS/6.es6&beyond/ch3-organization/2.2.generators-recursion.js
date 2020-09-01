// Because yield * can call another generator (by way of delegating to its iterator),
// it can also perform a sort of generator recursion by calling itself:

function *foo(x) { 
  x; //?
  if (x < 3) { 
    x;
    x = yield *foo( x + 1 ); 
    x; //?
  }
  x; //?
  return x * 2; //?
} 

foo( 1 ).next(); //?