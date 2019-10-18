var assert = require('assert');

var globalNinja = "Yoshi"; // global variable, using var

function reportActivity() {
  var functionActivity = "jumping"; // function local variable, using var

  for (var i = 1; i < 3; i++) {
    // IMPORTANT: within this scope, we have access to scope of function  reportActivity and global scope
    var forMessage = globalNinja + " " + functionActivity; // function local vars i and forMessage. IMPORTANT: the function scope has access to the for block's var i and var forMessage
    assert (forMessage === "Yoshi jumping", "error: Yoshi isn't jumping within the for block.");
    assert (i, "error: current loop counter doesn't exist");
    console.log(i);
  }
  // IMPORTANT: the variables of the for loop are accessible outside the for loop
  // IMPORTANT: variables declared with VAR are registered in the SCOPE of the MOST IMMEDIATE function SCOPE, or global SCOPE
  // this is a contrast from Object Oriented languages where variables are only in the scope of the BLOCK they are declared in
  assert (i === 3 && forMessage === "Yoshi jumping", "error: loop variables are not accessible outside of the loop");
  console.log("loop variable i is accessible outside the loop, it's value is :", i);
  console.log("loop variable forMessage is accessible outside the loop, it's value is :", forMessage);
}
reportActivity();

// IMPORTANT: the global scope still does not have access to the for loops variables (same as in OOP )
assert (typeof functionActivity === "undefined" && typeof i === "undefined" && typeof forMessage === "undefined",
                    "error: variable functionActivity is not undefined");
console.log("\n the inner variable functionActivity 's type is :", typeof functionActivity);
console.log("\n the inner variable i 's type is :", typeof i);
console.log("\n the inner variable forMessage 's type is :", typeof forMessage);