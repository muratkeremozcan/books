// object literal
let shape = {
  name: "rectangle",
  color: "red",
  size: {
    length: 10,
    breadth: 20
  },
  watch() {
    return console.log("I am shape");
  }
};

console.log(shape);
console.log(shape.size);
console.log(shape.size.length);
shape.watch();

let one = 1;
let two = 2;
let three = 3;

// ES5 shorthand 
let numbers = {one,two, three}; //?

// longer, old way
// let numbers = {
//   one: one,
//   two: two,
//   three: three
// };

numbers.one; //?
numbers.two; //?

// limitation: no linking 
Object.getPrototypeOf(shape); //?  
shape.hasOwnProperty('size'); //?
Object.getOwnPropertyNames(shape); //?
shape.__proto__; //?
shape.__proto__.__proto__; //?