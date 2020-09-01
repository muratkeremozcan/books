// You cannot have a reference from one JS variable to another variable. 
  // A reference in JS points at a (shared) value, 
  // In JavaScript, there are no syntactic hints that control value versus reference assignment/passing. 
  // Instead, the type of the value solely controls whether that value will be assigned by value-copy or by reference-copy.
  
  // TL,DR; after assigning arrays or objects, careful when modifying them in place (push, pop etc) - ok to make new assignments. In meta, use Array.from and Object.assign to make copies

  // Simple values (simple scalar primitives) are always assigned/passed by value-copy: boolean, number, string, null, undefined, ES6’s symbol. 
  var a = 2;
  var b = a; // b is assigned a copy of the value 2
  b++; // when changing b, you are not changing a
  a
  b

  // Compound values — objects (including arrays, and all boxed object wrappers) and functions — always create a reference-copy
  var c = [1,2,3];
  var d = c; // d is a reference to the shared '[1,2,3]' value
  d.push(4); // when changing d, you change c 

  d
  c
  c === d; //?
  
  ////
  // create a reference copy, and modify it

  a = [1,2,3];
  b = a;
  a 
  b

  // When we make the assignment b = [4,5,6], we are doing absolutely nothing to affect where a is still referencing ([1,2,3]).
  b.push(10); // changes a
  a
  b = [4,5,6]; // does not change a, because new assignment
  a
  b