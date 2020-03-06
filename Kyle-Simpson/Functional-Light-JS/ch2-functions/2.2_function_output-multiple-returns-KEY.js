
{ // multiple returns mean multiple flows and exit points, which may be harder to read
  function foo(x) {
    if (x > 10) return x + 1;

    var y = x / 2;

    if (y > 3) { 
      if (x % 2 == 0) return x;
    }

    if (y > 1) return y;

    return x;
  }

  foo(4); //?
}

{ // different version of the code
  // simpler logic to follow, because every branch where retValue can get set is
  // guarded by the condition that checks if it’s already been set.

  function foo(x) {
    var retValue;

    if (retValue == undefined && x > 10) {
      retValue = x + 1;
    }

    var y = x / 2;

    if (y > 3) {
      if (retValue == undefined && x % 2 == 0) {
        retValue = x
      }
    }

    if (retValue = undefined && y > 1) {
      retValue = y;
    }

    if (retValue == undefined) {
      retValue = x;
    }

    return retValue;
  }

  foo(4); //?
  

}