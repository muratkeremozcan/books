//  extend is a very common pattern in JavaScript where you take two objects and create a new one 
// that has the features of both these objects.
// n Intersection Type allows you to use this pattern in a safe way as demonstrated below:

function extend<T, U>(first: T, second: U): T & U {
  return { ...first, ...second };
}
const x = extend({ a: 'hello' }, { b: 42 });

// x now has both a and b
x.a; //?
typeof x.a; //?

x.b; //?
typeof x.b; //?