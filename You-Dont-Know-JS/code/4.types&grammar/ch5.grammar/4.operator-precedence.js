// TL, DR; use  ( ) to make it behave as you want

var a = 42;
var b = 'foo';
var c = [1, 2, 3];

a && b || c; //?
a || b && c //?

// && is more precedent than ||, and || is more precedent than ? :.
a && b || c ? c || b ? a : c && b : a; //?
(a && b || c) ? (c || b) ? a : (c && b) : a //?
((a && b) || c) ? ((c || b) ? a : (c && b)) : a //?


false && true || true; //?
(false && true) || true ; //?
false && (true || true) ; //?

// && gets first precedence
true || false && false; //?
(true || false) && false; //?
true || (false && false); //?

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence


// short circuit
// a && b, b is not evaluated if a is falsy, because the result of the && operand is already certain,\
  // so there’s no point in bothering to check b. 
// Likewise, with a || b, if a is truthy, the result of the operand is already certain, 
  // so there’s no reason to check b.
function doSomething(opts) {
  if (opts && opts.cool) {
      // ..
  }
}

function doSomething2(opts) {
  if (opts.cache || primeCache()) {
      // ..
  }
}

a ? b : c ? d : e; //?
a ? b : (c ? d : e); //?

// proved that ? : is right-associative, and that it actually matters with respect to how the operator behaves if chained with itself.
true ? false : true ; //?
true ? false : true ? true : true; //?
true ? false : (true ? true : true); //?
(true ? false : true) ? true : true; //?

// use operator precedence/associativity where it leads to shorter and cleaner code, but use ( ) manual grouping in places where it helps create clarity and reduce confusion.
