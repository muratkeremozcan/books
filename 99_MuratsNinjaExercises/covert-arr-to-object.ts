// https://stackoverflow.com/questions/54789406/convert-array-to-object-keys
const arr: Array<string> = ["a", "b", "c"];
const res = arr.reduce(
  (acc: { [key: string]: string }, curr) => ((acc[curr] = curr), acc),
  {}
); //or use acc:any
console.log(res);

let target = {};
["a", "b", "c"].forEach((key) => (target[key] = key));
target;

const array = Object.assign(
  {},
  ...["a", "b", "c"].map((key) => ({ [key]: key }))
);
console.log(array);

let k = ["a", "b", "c"];

let obj = k.reduce(function (acc, curr) {
  acc[curr] = curr;
  return acc;
}, {});

obj //?

// comma operator
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator
let x = 1;

x = (x++, x);

x; //?
// expected output: 2

x = (2, 3);

x; //?
// expected output: 3
