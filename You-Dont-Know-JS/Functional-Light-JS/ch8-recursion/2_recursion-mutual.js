//// mutual recursion: When two or more functions call each other in a recursive cycle
// this is silly, but demonstrates mutual recursion well

function isOdd(v) {
  if (v === 0) return false;
  v
  return isEven(Math.abs(v) -1);
}
function isEven(v) {
  if (v === 0) return true;
  v;
  return isOdd(Math.abs(v -1));
}

isOdd(3); //?


//// fibonacci with mutual recursion

function fib_(n) {
  if (n == 1) return 1;
  else return fib (n - 2);
}

function fib(n) {
  if (n == 0) return 0;
  else return fib (n - 1) + fib_(n);
}
fib(6); //?