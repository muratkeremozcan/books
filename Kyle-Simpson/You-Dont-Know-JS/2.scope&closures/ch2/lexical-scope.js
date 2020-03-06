// Scope look-up stops once it finds the first match. The same identifier name can be specified at multiple layers of nested scope, which is called shadowing (the inner identifier shadows the outer identifier)
// Scope look-up always start at the innermost scope being executed at the time, and works its way outward/upward until first match and stops.

// the Engine executes the console.log(…) statement and goes looking for the three referenced variables a, b, and c. 
// It starts with innermost scope bubble, Bubble 3 (function bar() ). Looking for a
// It won’t find a there, so it goes up one level, out to the next nearest scope bubble, Bubble 2 (function foo() ). It finds a there, and so it uses that a. 
// Same thing for b. But c, it does find inside of bar(…), Bubble 3, takes 12 immediately


function foo(a) {

  var b = a * 2;

  var c = 10; // the c here is looked at later than bar() and therefore ignored
  function bar(c) {
    console.log(a, b, c);
  }

  bar(b * 3);
}

foo(2); // 2, 4, 12



// trivia: what is the output? order of ops
var num = 4;
function outer() {
  var num = 5; // 3rd precedence
  function inner() {
    num++; // 2nd precedence
    // scope lookup starts looking for num here, finds it and BAM
    var num = 3; // 1st precedence
    console.log(num);
  }
  inner();
}
outer();