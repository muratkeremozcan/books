// promise constructor takes 2 callback parameters generally called (resolve, reject) 
// The callbacks provided to then  can also be called anything, generally called onFulfilled, onRejected
// end with a catch(function(error) { .. }) for the whole package

function makeAPromiseWithValue(value) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(value);
      }, Math.random() * 1000);

      setTimeout(function () {
        reject('rejector kicked in');
      },  800); // change the value to simulate rejection

    });
}

const promise1 = makeAPromiseWithValue('First');
const promise2 = makeAPromiseWithValue('Second');
const promise3 = makeAPromiseWithValue('Third');

// Promise.all takes an array of promises
Promise.all([promise1, promise2, promise3])
  .then(
    function onFulfilled(promiseValues) {
      // promiseValues is an array of `.then()` values in the same order of their promises in the array passed into Promise.all()
      console.log(promiseValues.join(','));
    },
    // delete the argument to simulate .catch. Change the timeouts to see if it is rejected
    function onRejected(e) { 
      console.log(e);
    }
  )
  .catch(
    function (err) {
      console.log(err);
    }
  )
  