// ToPrimitive abstract coercion operation is used when an object must be coerced to a primitive value for some operation 
// (such as == comparison or + addition). Prior to ES6, there was no way to control this behavior.
// in ES6 the @@ toPrimitive symbol as a property on any object value can customize that ToPrimitive coercion by specifying a method.

var arr = [1,2, 3, 4, 5];

arr + 10; //?

// The Symbol.toPrimitive method will be provided with a hint of "string", "number", or "default"
// depending on what type the operation invoking ToPrimitive is expecting.
// in this snippet the additive + operation has no hint (" default" is passed). 
// A multiplicative * operation would hint "number" and a String( arr) would hint "string".
arr[Symbol.toPrimitive] = function(hint) {
  if (hint == 'default' || hint == 'number') {
    // sum all numbers
    return this.reduce( function(acc, curr) {
      return acc + curr;
    }, 0);
  }
};

arr + 10; //?
arr * 10; //?