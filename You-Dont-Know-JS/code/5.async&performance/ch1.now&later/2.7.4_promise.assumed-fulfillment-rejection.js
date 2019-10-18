// the default promise handler passes along whatever value it receives to the next Promise
  // if a rejection or fulfillment is omitted or a non-function value is passed
  // the value still gets passed

var p = new Promise(function (resolve, reject) {
  reject('oops');
});

var p2 = p.then(
  function fulfilled() {
    // never gets here
    console.log('hoi');
  },
  // BY default, there is an assumed rejection handler, if it is omitted or any other non-function value passed
    // with or without this function, it will still oops
    // this allows the error to continue propagating along a Promise chain 
    // until an explicitly defined rejection handler is encountered.

  // function rejected(err) {
  //   console.log('hii')
  //   throw err;
  // }
).catch(function(err) {
  console.log(err);
})



var p3 = Promise.resolve(42);

p3.then(
  // assumed fulfillment handler, if omitted or any non-function value passed
    // with or without this function, it will still return what got passed in
  
    // function (v) {
  //   console.log('noi');
  //   return v;
  // },


  null,
  function rejected(err) {
    // never gets here 
  }

  // The then(null,function(err){ .. }) pattern — only handling rejections (if any) but letting fulfillments pass through 
  // — has a shortcut in the API: catch(function(err){ .. })
).catch(function (err) { // never gets here either
  console.log(err);
})