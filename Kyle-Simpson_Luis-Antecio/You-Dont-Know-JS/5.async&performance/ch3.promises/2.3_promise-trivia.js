/* TRUST ISSUES WITH CALLBACKS
- Call the callback too early  - not an issue with promises
- Call the callback too late (or never)  - not an issue with promises
- Call the callback too few or too many times - not an issue with promises
- Fail to pass along any necessary environment/parameters  -  Promises can only resolve or reject once
    // If you want to pass along multiple values, you must wrap them in another single value that you pass, such as an array or an object.
- Swallow any errors/exceptions that may happen

The characteristics of Promises are intentionally designed to provide useful, repeatable answers to all these concerns.
*/

var p = Promise.resolve();

p.then(function () {
  p.then(function () {
    console.log("C");
  });
  console.log("A");
});
p.then(function () {
  console.log("B");
});
// A B C


/////////

var p3 = new Promise(function (resolve, reject) {
  resolve("B");
});

var p1 = new Promise(function (resolve, reject) {
  resolve(p3);
});  

var p2 = new Promise(function (resolve, reject) {
  resolve("A");
});  

p1.then(function (v) {
  console.log(v);
});

p2.then(function (v) {
  console.log(v);
});


// A B
// p1 is resolved not with an immediate value, but with another promise p3, which is itself resolved with the value "B". 
// The specified behavior is to unwrap p3 into p1, but asynchronously, so p1’s callback(s) are behind p2’s callback(s) in the asynchronus Job queue
