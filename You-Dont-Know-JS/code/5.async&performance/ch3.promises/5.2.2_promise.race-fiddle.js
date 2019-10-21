// promise constructor takes 2 callback parameters generally called (resolve, reject) 
// The callbacks provided to then  can also be called anything, generally called onFulfilled, onRejected
// end with a catch(function(error) { .. }) for the whole package

function makePromises(val) {
  return new Promise((resolve, reject) => {

    setTimeout(() => resolve(val), Math.random() * 1000);

    setTimeout(() => reject('rejector kicked in'), Math.random() * 2000);

  });
}

const prom1 = makePromises('first');
const prom2 = makePromises('second');
const prom3 = makePromises('third');

Promise.race([prom1, prom2, prom3])
  .then(
    function onfulfilled(promisedValue) {
      console.log(promisedValue)
    },
    function onRejected(e) {
      console.log(e)
    }
  )
  .catch(
    function (err) {
      console.log(err);
    }
  )
