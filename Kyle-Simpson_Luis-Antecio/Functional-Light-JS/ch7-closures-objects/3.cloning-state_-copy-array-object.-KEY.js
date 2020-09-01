// If you’re not using a purpose-built library to provide sophisticated immutable data structures, 
// the simplest approach will suffice: duplicate your objects/arrays each time before making a change.
// similar to ch 6 1_copy-instead-of-mutate-KEY

// arrays

var a = [1,2,3];
// to clone an array (and work around reference copy), wrap the argument in array and spread it
var b = [...a];

b.push(4);
a;
b;


// objects: the below only works for shallow copy. Use a library for deep-copy
// https://lodash.com/docs/4.17.15#cloneDeep

var o = {
  x: 1,
  y: 2
};
// to clone an object (and work around reference copy), use object spreadES 2018+,
var p = {...o};

p.y = 3;
o;
p;

// in ES6 you can use Object.assign
var r = Object.assign({}, o);

r.y = 4;
o;
r;