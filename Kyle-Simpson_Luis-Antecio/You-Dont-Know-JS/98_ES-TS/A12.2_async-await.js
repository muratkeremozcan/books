// CONVERT raw promises (PROMISE CONSTRUCTOR STYLE) TO ASYNC AWAIT STYLE

// Since Node 7.6, you can combine the functions promisify function from the utils module with setTimeout() .
// Node.js

// const sleep = require('util').promisify(setTimeout)

// Javascript
// const sleep = m => new Promise(r => setTimeout(r, m))

// Usage
// (async () => {
//     console.time("Slept for")
//     await sleep(3000)
//     console.timeEnd("Slept for")
// })()

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function getCustomers() {
  // async functions do not need promise constructor , does not need resolve or reject functions
  // you can additionally add try catch scaffolding to async functions
  // setTimeout is different in async await
  try {
    console.log("Getting customers");
    // Emulate an async server call here
    await sleep(1000);
    var success = true; // switch to folse to test reject
    // const success = Math.random() >= 0.5; // randomized boolean
    if (success) {
      const customerName = 'John Smith';
      console.log(customerName);
      return customerName;
    } else {
      console.log("Can't get customers");
    }
  } catch (err) {
    console.log(err);
  }
}

async function getOrders(customer) {
  try {
    console.log('Getting orders');
    await sleep(2000);
    const success = true; // switch to folse to test reject
    // const success = Math.random() >= 0.5; // randomized boolean
    if (success) {
      const cust = await customer;
      return `Found the order 123 for customer ${cust}`;
    } else {
      return 'Cannot get orders';
    }
  } catch (err) {
    console.log(err);
  }
}


// getCustomers()
//   .then(cust => {
//     console.log(cust);
//     return cust;
//   })
//   .then(cust => getOrders(cust))  // John Smith gets passed in
//   .then(orderMessage => console.log(orderMessage))
//   .catch(err => console.log(err));



const cust = await getCustomers();
cust //?
const orderMessage = await getOrders(cust);
orderMessage //?

/////////////
// Immediately invoked function expression example and Promise.all

// ( async function getCustomerOrders() {
//   try {
//     // const customer = await getCustomers();
//     // const orderMessage = await getOrders();

//     const [customer, orderMessage] = await Promise.all([getCustomers(), getOrders()]);
  
//   } catch (err) {
//     console.log(err);
//   }
// })();


