// what sort of expression operations require/force (implicitly) a boolean coercion?

// 1. The test expression in an if (..) statement
// 2. The test expression (second clause) in a for loop ( .. ; .. ; .. ) header
// 3. The test expression in while (..) and do..while(..) loops  
// 4. The test expression (first clause) in ? : ternary expressions  
// 5. The lefthand operand which serves as a test expression to the || and && operators

var a = 42;
var b = "abc";
var c;
var d = null;

// In all these contexts, the non-boolean values are implicitly coerced to their boolean equivalents to make the test decisions.

if (a) { console.log('yes') }; //?
while(c) { console.log('never runs') } //?
c = d ? a : b; //?
if( (a && d) || b) {console.log('yes') }; //?

