function makeAdder (x) {
  // parameter x is an inner variable

  // inner function add() uses x, so it has a closure over it
  console.log(x);
  function add(y) {
    console.log(x);
    console.log(y);
      return y + x; //?
  }

  return add;
}

// When we call makeAdder(1), we get back a reference to its inner add(..) that remembers x as 1.
var plusOne = makeAdder(1); //?

// plusOne() // y is undefined
makeAdder(1)(0);  // same as plusOne(0)

// When we call plusOne(3), it adds 3 (its inner y) to the 1 (remembered by x), and we get 4 as the result.
plusOne(3) //? 

// When we call makeAdder(10), we get back another reference to its inner add(..) that remembers x as 10.
var plusTen = makeAdder(10); 

// When we call plusTen(13), it adds 13 (its inner y) to the 10 (remembered by x), and we get 23 as the result.
plusTen(13); //?