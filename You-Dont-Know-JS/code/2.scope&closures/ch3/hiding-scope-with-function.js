// we can take any snippet of code and wrap a function around it, 
// and that effectively “hides” any enclosed variable or function declarations from the outside scope inside that function’s inner scope.

// here we hide doSomethingElse() from the outside

function doSomething(a) {

  var b;
  b = a + doSomethingElse(a * 2); //?
  console.log(b * 3);

  function doSomethingElse(a) {
    return a - 1;
  }
}

doSomething(2); //?


// trivia: hiding scope with function: create a private variable hidden from the outside

function SecretVariable() {
  const _x = 'Super secret code';

  let publicApi = {
    x: _x
  }
  return publicApi;
}

let secret = new SecretVariable();
secret.x; //?
secret._x; //?

