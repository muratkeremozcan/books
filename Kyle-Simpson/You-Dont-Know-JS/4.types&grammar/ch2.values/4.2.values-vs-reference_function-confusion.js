/// function example



var a = [1,2,3];
// (1) When we pass in the argument a to foo(x)  , the reference-copy to [1,2,3] is made for x , as in saying  x = a 
  // therefore a and x become separate references pointing at the same [1,2,3] value.
foo(a);

// [1,2,3,4], not [4,5,6,7]
a;

function foo(x) {
  // (2) Now, inside the function, we can use that reference to mutate the value itself
  x.push(4);
  x; //?

  // But if we make the assignment x = [4,5,6], this is in no way affecting where the initial reference a is pointing — a still points at the (now modified) [1,2,3,4] value.
  x = [4,5,6]; // this is not x = a ! This is good old proper value assignment. It does not effect a
  x.push(7); // mutate x all you want, does not effect a
  x; //?

  // To accomplish changing a to have the [4,5,6,7] value contents,  you must modify the existing array value:
    // (to make this work, disable the upper 3 lines)
  // x.length = 0; // reset the array
  // x.push(4,5,6,7); // mutate the array
  // x;
}
