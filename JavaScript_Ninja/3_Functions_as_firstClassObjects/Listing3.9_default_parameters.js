var assert = require('assert');

// DEFAULT PARAMETER: when invoking the function, if no argument is passed in, the default parameter is used.
function performAction(ninja, action = "skulking") {
  return ninja + " " + action;

}
assert(performAction("Fuma") === "Fuma skulking", "The default value is used for Fuma");
assert(performAction("Yagyu", "sneaking") === "Yagyu sneaking", "Yagyu can do whatever he pleases, even sneak!");

console.log(performAction("Fuma"));
console.log(performAction("Yoshi"));
console.log(performAction("Hattori"));
console.log(performAction("Yagyu", "sneaking"));
