function makePromises(val) {
  return new Promise((resolve, reject) => return 

    setTimeout(() => resolve(val), Math.random() * 1000);

    setTimeout(() => reject('cannot keep my promise'), Math.random() * 4000);

  );
}

function timeoutPromise(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject("Timed out!");
    }, delay);
  });
}

// keep rerunning to see different results
Promise.race([  // you can change to Promise.all if you like; play with the timeouts and resolve the timeoutPromise
  makePromises('a promise made'),
  timeoutPromise(100)    
])
.then(
  function onFulfilled(winningPromise){
    console.log('fulfilled in time');
    console.log(winningPromise);
  },
  function onNotFulfilled(err){
    // look at err to know if it was rejected or not finished in time
    console.log('rejected or not finished in time:', err);
  }
).catch(
  function(err) {
    console.log(err);
  }
)