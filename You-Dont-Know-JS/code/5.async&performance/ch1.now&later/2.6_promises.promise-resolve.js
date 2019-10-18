// How can we be sure that something we get back is in fact a trustable Promise? Promise.resolve(..) can guarantee that
// If you pass an immediate, non-Promise, non-thenable value to Promise.resolve(..), you get a promise that’s fulfilled with that value.

// p1 and p2 are the same
var p1 = new Promise(function (resolve, reject) {
  resolve(42);
});
var p2 = Promise.resolve(42);

p1;
p2


// if you pass a promise to Promise.resolve, you get the same promise back
var p3 = Promise.resolve(p1);
p3;


// if you pass a non-Promise thenable value to Promise.resolve(..), it will attempt to unwrap that value, 
  // and the unwrapping will keep going until a concrete final non-Promise-like value is extracted.
var p4 = {
  then: function (cb) {
    cb(42);
  }
};
// this works because p4 is thenable
p4.then(
  function fulfilled(val) {
    console.log(val);
  },
  function rejected(err) {
    // does not get here
  }
)

// what if p5 does not behave like a promise despite being thenable?
var p5 = {
  then: function(cb, errcb) {
    cb(42);
    errcb('evil laugh');
  }
};
p5.then(
  function fulfilled(val) {
    console.log(val);
  },
  function rejected(err) {
    console.log(err);
  }
)
// REGARDLESS we can pass either of these versions of p to Promise.resolve(..), and we’ll get the normalized, safe result we’d expect
// Promise.resolve(..) will accept any thenable, and unwrap it to its non-thenable value.
  // But you get back from Promise.resolve(..) a real, genuine Promise in its place, one that you can trust.
  // If what you passed in is already a genuine Promise, you just get it right back, 
  // so there’s no downside at all to filtering through Promise.resolve(..) to gain trust.

Promise.resolve(p5); //?
Promise.resolve(p5).then(
  function fulfilled(val) {
    console.log(val);
  },
  function rejected(err) {
    console.log(err);  // p5 does not get rejected with Promise.resolve(..) !
  }
)

///

// do this
Promise.resolve(p5).then(
  function(v) {
    console.log(v);
  }
) 
// don't do this
// p4.then(function(v) {
//   console.log(v);
// });

// Another beneficial side effect of wrapping Promise.resolve(..) around any function’s return value (thenable or not) 
  // is that it’s an easy way to normalize that function call into a well-behaving async task. 
  // If foo(42) returns an immediate value sometimes, or a Promise other times, Promise.resolve( foo(42) ) makes sure it’s always a Promise result.

