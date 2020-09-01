// array or object comparison is tricky arrays are compared if they are the same array object in memory

var a = [1, 2, 3] //?
var b = [1, 2, 3] //?
var c = '1,2,3';
a == c; //?
b == c; //?
a == b; //?
// this last one compares if the arrays are the same array object in memory, therefore it fails

// how do you check for array equality?

// (1) convert to strings: short but not so robust
a.toString() === b.toString(); //?

// (2) iterate through and compare
const arraysMatch = function (arr1, arr2) {
  if (arr1.length != arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};
arraysMatch(a, b); //?

// (3) use ES6
const arraysMatchEs6 = function (arr1, arr2) {
  return (arr1.length === arr2.length)
  && arr1.every(function (arr1Element, arr2index) {
    return arr1Element === arr2[arr2index];
  });
};
arraysMatchEs6(a, b); //?

// or you  can use ._.isEqual() which works both for arrays and objects
// https://lodash.com/docs/4.17.15#isEqual

//// object equality

const obj1 = {
  name: 'Kristine',
  age: 13,
  // favorites: {
  //   food: 'Pizza'
  // }
};

const obj2 = {
  name: 'Kristine',
  age: 13,
  // favorites: {
  //   food: 'Pizza'
  // }
};

// (1) same as array approach : iterate through and compare values
// problem is this only works for a  data structure is not shallow (1 level)
// for that just use ._.isEqual() 
const objectsMatch = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);  
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) return false;
  for (let objKey of obj1Keys) {
    if (obj1[objKey] !== obj2[objKey]) return false;
  }
  return true;
}

objectsMatch(obj1, obj2); //?