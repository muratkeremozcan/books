// type 1 : immediate resolve

const prom_immediate = new Promise(function (resolve, reject) {
  resolve('A');
})
// alternative
// const prom = Promise.resolve('A');

// a Promise is thenable 
// The callbacks provided to then  can be called anything, generally called onFulfilled, onRejected
// end with a catch(function(error) { .. }) for the whole package

prom_immediate.then(
  function onFulfilled(promisedValue) {
    console.log(promisedValue);
  },
  function onRejected(e) {
    console.log(e);
  }
).catch(err => console.log(err));


//////////////////////////
// type 2: promise constructor 
// takes 2 callback parameters generally called (resolve, reject) 

function makePromise(val) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(val);
    }, Math.random() * 1000);
    setTimeout(function () {
      reject('rejected!');
    }, Math.random() * 2000);
  });
}

const prom_constructor = makePromise('I have resolved thee');

prom_constructor.then(
  function onFulfilled(promisedValue) { // remove argument to simulate catch
    console.log(promisedValue);
  },
  function onRejected(e) { // chance timeouts to simulate rejection
    console.log(e);
  }
) // you could keep chaining here
  .catch(
    function (err) {
      console.log(err);
    }
  );