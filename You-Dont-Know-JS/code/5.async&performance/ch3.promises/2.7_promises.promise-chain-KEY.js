// Every time you call then(..) on a Promise, it creates and returns a new Promise, which we can chain with. 
// Whatever value you return from the then(..) call’s fulfillment callback (the first parameter)
 // is automatically set as the fulfillment of the chained Promise (from the first point).

var p = Promise.resolve(21);

var p2 = p.then(function (v) {
  console.log(v);
  return v * 2; // fulfill p2 with value 42
});

// chain off p2
// When p2’s then(..) call runs, it’s receiving the fulfillment from the return v * 2 statement.
p2.then(function (v) {
  console.log(v);
});

// instead of creating a variable, we can chain all this together
p.then(function (v) {
  console.log(v);
  return v * 2;
}).then(function (v) {
  console.log(v);
  return v * 2;
}).then(function (v) {
  console.log(v);
});


// What if we want step 2 to wait for step 1 to do something asynchronous? 
// We’re using an immediate return statement, which immediately fulfills the chained promise.

p.then(function (v) {
  console.log(v);
  // instead of an immediate return statement, create a promise and return that so this step waits asynchronously
  return new Promise(function (resolve, reject) {
    resolve(v * 2);
  });
}).then(function (v) {
  console.log(v);
  return new Promise(function (resolve, reject) {
    resolve(v * 2);
  })
}).then(function (v) {
  console.log(v);
  return Promise.resolve(v * 2); // return Promise.resolve(..)  is the same as return new Promise(function(resolve, reject){..resolve(..)})
}).then(function (v) {
  console.log(v);
});

//////////
// introduce asynchrony 
p.then(function (v) {
  console.log(v);

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(v * 2);
    }, 100)
  });
}).then(function (v) {

  console.log(v);

  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(v * 2);
      }, 200);
    });
  });
}).then(function (v) {
  console.log(v);
})
