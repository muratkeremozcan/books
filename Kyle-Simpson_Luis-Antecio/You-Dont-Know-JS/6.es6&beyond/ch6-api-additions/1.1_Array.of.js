// quirk with Array() constructor: if there’s only one argument passed, and that argument is a number, 
// instead of making an array of one element with that number value in it, it constructs an empty array with a length property equal to the number.

var a = Array(3);
a.length; //?
a[0];
// we want this:
a = [3]; 
a; 

// Array.of(..) replaces Array(..) as the preferred function-form constructor
a = Array.of(3);
a.length; //?
a;

var b = Array.of(1, 2, 3);
b.length; //?
b;


// When would you use Array.of(..) instead of just creating an array with literal syntax, like c = [1,2,3]?
// * If you have a callback that’s supposed to wrap argument(s) passed to it in an array, Array.of(..) - this is not very common
// * If you create a subclass of Array

class MyCoolArray extends Array {
  sum() {
    return this.reduce(function reducer(acc, curr) {
      return acc + curr;
    }, 0);
  }
}

var x = new MyCoolArray(3);
// we do not want this:
x.length; //?
x.sum(); //?

var y = [3];
y.length; //?
// no custom sum() function
// y.sum(); //?

// Gotcha: can't use constructor: var z = new MyCoolArray.of(..)
var z = MyCoolArray.of(3);
z.length; //?
z.sum(); //?
// You can’t just (easily) create a constructor for MyCoolArray that overrides the behavior of the Array parent constructor, 
// because that constructor is necessary to actually create a well-behaving array value (initializing the this). 
// The “inherited” static of(..) method on the MyCoolArray subclass provides a nice solution.
