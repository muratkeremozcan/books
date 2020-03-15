const doubleIt = v => v * 2;
const isOdd = v => v % 2;
const isEven = v => !(v % 2); // or  isEven = not(isOdd)

[1, 2, 3, 4, 5].map(doubleIt); //?
[1, 2, 3, 4, 5].filter(isOdd); //?
[1, 2, 3, 4, 5].filter(isEven); //?

const summingReducer = (accumulator, current) => accumulator + current;
[1, 2, 3, 4, 5].reduce(summingReducer); //?
[1, 2, 3, 4, 5].reduce(summingReducer, 1); //?

const multiplyingReducer = (accumulator, current) => accumulator * current;
[1, 2, 3, 4, 5].reduce(multiplyingReducer); //?
[1, 2, 3, 4, 5].reduce(multiplyingReducer, 2); //?

/// exercise
{
  function foo() {
    return 42;
  }
  function bar() {
    return 10;
  }
  function add(x, y) {
    return x + y;
  }
  function add2(fn1, fn2) {
    return add(fn1(), fn2());
  }
  add2(foo, bar); //?
}

{
  function foo(x) {
    return function inner() {
      return x;
    }
  }
  function bar(y) {
    return function inner() {
      return y;
    }
  }
  function add(x, y) {
    return x + y;
  }
  function add2(fn1,fn2) {
    return add( fn1(), fn2() );
  }
  add2(foo(42), bar(10)); //?

  function addn (arr) {
    arr.map(foo)
}


