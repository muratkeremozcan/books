// Promises
// We can instantiate a Promise object by providing two functions to its constructor: 
// the function to call if the operation is fulfilled, and the function to call if the operation is rejected

function getCustomers() {

  return new Promise(function (resolve, reject) { // promise constructor
    console.log("Getting customers");
    // Emulate an async server call here
    setTimeout(function () {
      // var success = true; // switch to folse to test reject
      const success = Math.random() >= 0.5; // randomized boolean
      if (success) {
        resolve("John Smith");
      } else {
        reject("Can't get customers");
      }
    }, 1000);
  });
}

function getOrders(customer) {
  return new Promise(function (resolve, reject) {
    console.log('Getting orders');
    setTimeout(function () {
      // const success = true; // switch to folse to test reject
      const success = Math.random() >= 0.5; // randomized boolean
      if (success) {
        resolve(`Found the order 123 for customer ${customer}`);
      } else {
        reject('Cannot get orders');
      }
    }, 1000);
  });
}

getCustomers()
  .then(cust => {
    console.log(cust);
    return cust;
  })
  .then(cust => getOrders(cust))  // John Smith gets passed in
  .then(orderMessage => console.log(orderMessage))
  .catch(err => console.log(err));
// We can chain multiple function calls using then() and have just one error-handling script for all chained invocations.
// If an error occurs, it will be propagated through the entire chain of thens until it finds an error handler
// No thens will be invoked after the error.


// A.12
// getCustomers()
//   .then(cust => console.log(cust)) // resolved
//   .catch(err => console.log(err)); // rejected
// console.log('invoked getCustomers, waiting for result');