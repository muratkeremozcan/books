// indexOf() has been used most commonly

var a = [1, 2, 3, 4, 5];
a.indexOf(3); //?
a.indexOf(7); //?
// Problem: cumbersome to compare against the -1 value to see if something exists
(a.indexOf(6) !== -1); //?


// in ES5, some() was used to have control over the matching logic
// problem: you get indication that matching value was found, but no info on the what the value was
a.some( function matcher(v) {
  return v === 2;
}); //?
a.some( v => v === 7); //?


// ES6's find() addresses these issues
a.find(v => v == 2); //?
a.find(v => v == 7); //?


// Using a custom matcher(..) function also lets you match against complex values like objects:
var points = [
  { x: 10, y: 20 }, 
  { x: 20, y: 30 }, 
  { x: 30, y: 40 }, 
  { x: 40, y: 50 }, 
  { x: 50, y: 60 }
];

points.find( function matcher(point) {
  return (
    point.x % 3 == 0 &&
    point.y % 4 == 0
  )
}); //?

// As with other array methods that take callbacks, find(..) takes an optional second argument 
// that if set will specify the this binding for the callback passed as the first argument. Otherwise, this will be undefined.
