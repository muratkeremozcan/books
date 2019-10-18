console.log('1st ) function declarations; type of fun is: ', typeof fun);
var fun = 3;
console.log('2nd) vars, func expressions, arrow functions 2nd; type of fun is: ', typeof fun);
function fun() {}
console.log('3rd) any other code. During actual program execution, function declarations are skipped; type of fun is :', typeof fun);

// IMPORTANT: HOISTING IN SUMMARY
// 1st ) Function declarations, their arguments hoisted to the top. During executions, the declarations are skipped
// 2nd ) variable declarations, function expressions and arrow functions
// 3rd ) the rest of the code