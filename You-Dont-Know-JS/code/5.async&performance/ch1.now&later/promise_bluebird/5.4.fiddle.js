var Promise = require('bluebird');


// none([ .. ]) This pattern is like all([ .. ]), but fulfillments and rejections are transposed. 
  // All Promises need to be rejected — rejections become the fulfillment values and vice versa. 

// any([ .. ]) This pattern is like all([ .. ]), but it ignores any rejections, so only one needs to fulfill instead of all of them.

// first([ .. ]) This pattern is like a race with any([ .. ]), which means that it ignores any rejections 
  //and fulfills as soon as the first Promise fulfills. 
  
// last([ .. ]) This pattern is like first([ .. ]), but only the latest fulfillment wins.



function makePromises(val) {
  return new Promise((resolve, reject) => {

    setTimeout(() => resolve(val), Math.random() * 1000);

    setTimeout(() => reject('cannot keep my promise'), Math.random() * 2000);

  });
}

function timeoutPromise(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject("Timed out!");
    }, delay);
  });
}

// keep rerunning to see different results
Promise.any([
  makePromises('a promise made'),
  timeoutPromise(500)
])
.then(
  function onFulfilled(){
    console.log('fulfilled in time');
  },
  function onNotFulfilled(err){
    // look at err to know if it was rejected or not finished
    console.log('rejected or not finished in time:', err);
  }
).catch(
  function(err) {
    console.log(err);
  }
) 