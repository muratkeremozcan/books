// in js functions always return a value

{ // The undefined value is implicitly returned if you have no return or if you just have an empty return
  function foo() { }
  function bar() {
    return;
  }
  function baz() {
    return undefined;
  }

  foo(); //?
  bar(); //?
  baz(); //?
}

{ // if your function needs to return multiple values, your only viable option is to collect them into a compound value like an array or an object:
  function foo() {
    var retValue1 = 11;
    var retValue2 = 31;
    return [retValue1, retValue2];
    // return {retValue1, retValue2}; // or toggle this
  }
  foo() //?

  // Collecting multiple values into an array (or object) to return, and subsequently destructuring those values back into distinct
  // assignments, is a way to transparently express multiple outputs for a function.
  var [x, y] = foo(); 
  // var {retValue1: x, retValue2: y} = foo(); // or toggle this, mind that property and value need to be duplicated if you want to shorten it (can't use x, y, must use retValue1 retValue2)
  x;
  y;
}
