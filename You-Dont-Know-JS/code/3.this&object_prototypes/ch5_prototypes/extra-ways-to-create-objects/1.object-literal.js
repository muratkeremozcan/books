// object literal
let shape = {
  name: "rectangle",
  color: "red",
  size: {
    length: 10,
    breadth: 20
  }
};
console.log(shape);
console.log(shape.size);
console.log(shape.size.length);

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
