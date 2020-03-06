// Array.from() has another trick: if a 2nd argument is provided, it is a mapping callback,
// which is called to map/ transform each value from the source to the returned target.

var arrLike = {
  length: 4,
  2: 'foo'
}


Array.from(arrLike, function mapper(val, idx) {
  if (typeof val === 'string'){
    return val.toUpperCase();
  } else {
    return idx;
  }
}); //?

// Note: As with other array methods that take callbacks, 
// Array.from(..) takes an optional third argument that if set will specify the this binding for the callback passed as the second argument. 
// Otherwise, this will be undefined.