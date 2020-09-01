// a constant is a variable that’s read-only after its initial value is set.

// A const declaration must have an explicit initialization.
{
  //  If you wanted a constant with the undefined value, you’d have to declare const a = undefined to get it. 
  // const a; // will not work
  // const a = undefined; // will work

  const a = 2; // will not work at the same time with the above
  console.log(a);

  // a = 3; // cannot reassign! LHS/TypeError 
}

// Constants are not a restriction on the value itself, but on the variable’s assignment of that value. 
// In other words, the value is not frozen or immutable because of const, just the assignment of it
// If the value is complex, such as an object or array, the contents of the value can still be modified:
// Recall...
// simple primitives  : string  number  boolean  object  null   undefined  
// complex primitives  : String  Number  Boolean  Object  Array  Date  RegExp  Error (all of type object)
// side note, falsies : ''      0       false            null   undefined
{
  const a = [1, 2, 3];
  a.push(4);
  a; 

  // a = 42; // cannot reassign! LHS/TypeError
}

// const can be used with variable declarations of for, for.. in, and for.. of loops \
// However, an error will be thrown if there’s any attempt to reassign, such as the typical i + + clause of a for loop.
