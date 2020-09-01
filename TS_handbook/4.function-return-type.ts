function add(n1: number, n2: number): number { // in these cases, best to let TS infer the function return type
  return n1 + n2;
}

function printResult(num: number): void { // this is to just show what is happening behind the scenes
  return console.log('Result = ' + num);
}

function printResult_undef(num: number): undefined { // TS makes a differentiation between void and undefined
  console.log('Result = ' + num);
  return;
}

printResult(add(5, 12));
printResult_undef(add(5, 12));


//////
// Function types

{ // simple Function type

  let combineValues: Function;

  combineValues = add;
  // combineValues = 5; // TS will complain: can't assign function to a number

  combineValues(8, 8); //?
}

{ // function with return type

  let combineValues: (a: number, b:number) => number; // should accept 2 args as numbers and return a number

  combineValues = add;
  // combineValues = printResult;  // TS will complain: function that returns void is not assignable to a function that returns number

  combineValues(8, 8); //?
}

// another example of function with return type

function addAndHandle(n1: number, n2: number, cb: (num: number) => void){
  const result = n1 + n2;
  cb(result);
}

// TS infers that the callback result will take a number as an argument and return void
addAndHandle(10, 20, result => { console.log(result) } );