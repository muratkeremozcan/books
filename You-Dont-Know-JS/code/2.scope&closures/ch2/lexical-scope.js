// scope look-up always starts at the innermost scope being executed at the time, 
  // and works its way outward/upward until the first match, and stops.

function foo(a) {

  var b = a * 2;

  var c = 10; // the c here is looked at later than bar() and therefore ignored
  function bar(c) {
    console.log(a, b, c);
  }

  bar(b * 3);
}

foo(2); // 2, 4, 12

