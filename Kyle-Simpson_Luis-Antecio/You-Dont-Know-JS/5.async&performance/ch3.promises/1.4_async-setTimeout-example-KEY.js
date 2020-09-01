// promise constructor takes 2 callback parameters generally called (resolve, reject) 
// The callbacks provided to then  can also be called anything, generally called onFulfilled, onRejected
// end with a catch(function(error) { .. }) for the whole package


const setTimeout_promiseConstructor = function (value, timeout) {
  return new Promise(function (resolve, reject) {

    setTimeout(function () {
      resolve(value);
    }, Math.random() * timeout);

    setTimeout(function () {
      reject('rejector kicked in');
    }, 600); // change the value to simulate rejection

  });
}


setTimeout_promiseConstructor('firstVal', 1000)
  .then(
    function onFulfilled(val) {
      console.log(`${val}`);
    },
    function onRejected(e) {
      console.log(e);
    }
  )
  .catch(
    function (err) {
      console.log(err);
    }
  )

///////////////
// async await, can have try catch. 
// Just put the promise constructor inside the try block. 
// No need to end the chain with .catch(function(err) { .. }) ; you can take care of it with the catch block

const setTimeout_asyncPromise = async function (value, timeout) {
  try {
    return new Promise(function (resolve, reject) {

      setTimeout(function () {
        resolve(value);
      }, Math.random() * timeout);

      setTimeout(function () {
        reject('2nd rejector kicked in');
      }, 600)
    });
  } catch (err) {
    console.log('promise did not work :', err);
  }
}

// increase timeout to simulate rejection
await setTimeout_asyncPromise('secondVal', 100); //?
