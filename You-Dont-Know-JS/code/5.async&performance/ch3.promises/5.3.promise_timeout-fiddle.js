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
Promise.race([
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