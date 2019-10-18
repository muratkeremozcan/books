// implicit block scoping in ES6
{
  let a = 2;
  console.log( a ); // 2
}

// block scoping before
try{throw 2}catch(a){
  console.log( a ); // 2
}
// That’s right, the catch clause has block-scoping to it, which means it can be used as a polyfill for block scope in pre-ES6 environments.


// Traceur compile result
{
  try {
    throw undefined;
  } catch (a) {
    a = 2;
    console.log( a );
  }
}


console.log( a ); // ReferenceError