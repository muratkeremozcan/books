{ // not extremely pure, because count variable changes
  function foo() {
    var count = 0;

    return function () {
      return count++;
    };
  }

  var x = foo();
  x(); //?
  x(); //?
  x(); //?
}

{ // this is strictly pure because x never changes
  function sumX(x) {
    return function(y) {
      return x + y;
    }
  }

  var add10 = sumX(10)
  
  add10(2); //?
  add10(5); //?
}


// exercise 
{ // define foo(), it produces a function which remembers only first 2 args that were passed to it, and always adds them together
  const foo = (x, y) => () => x + y;
  var x = foo(3,4);

  x(5); //?
  x(10); //?
  x(20); //?
}