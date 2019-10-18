// PASSIVE SUB-EXPRESSION:
// to indicate that a set of parenthesis shouldn't result in a capture, the regex syntax lets us put the notation ?: immediately after the opening parantheses
const pattern = /((?:ninja-)+)sword/; // uses a passive sub-expression

const ninjas = "ninja-ninja-sword".match(pattern);

console.log(ninjas);