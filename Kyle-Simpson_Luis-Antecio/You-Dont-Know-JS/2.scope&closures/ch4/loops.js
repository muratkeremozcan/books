// if you use var, 6 gets printed out 5 times
// because timer function(s) are closed over the same shared global scope
// There’s no difference than if each of the five timeout callbacks were just declared one right after the other, with no loop at all.

// There’s a special behavior defined for let declarations used in the head of a for loop
// the variable will be declared not just once for the loop, but each iteration.

for (var i=1; i<=5; i++) { 
  console.log(i);
  setTimeout( function timer(){
      console.log( i );
  }, i*1000 );
}

// you can use let or an IIFE 
// The use of an IIFE inside each iteration created a new scope for each iteration, 
// which gave our timeout function callbacks the opportunity to close over a new scope for each iteration, 
// one which had a variable with the right per-iteration value in it for us to access.

for (var k = 1; k <= 5; k++) {
  console.log(k);
  
  // var l = k; // we can either assign k to l, or call the IIFE with k, then pass in l as an argument
  (function (l) {
    setTimeout(function timer() {
      console.log(l);
    }, l * 1000);
  }(k));
}

// let in for loops is great
// TL, DR; The let i in the for header declares an i not just for the for loop itself, but it re-declares a new i for each iteration of the loop.
//  That means that closures created inside the loop iteration close over those per-iteration variables the way you’d expect.