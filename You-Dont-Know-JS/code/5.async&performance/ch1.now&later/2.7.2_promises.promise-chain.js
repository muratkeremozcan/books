// we can construct a sequence of however many async steps we want, and each step can delay the next step (or not!), as necessary.

function delay(time) {
  return new Promise(function (resolve, reject) {
    // setTimeout(resolve, time); // this would not pass any value
    setTimeout(function () {
      resolve(time); // passing the time value from step to step
    }, time)
  });
}

// the value passing from step to step in these examples is optional. 
// If you don’t return an explicit value, an implicit undefined is assumed,


// Calling delay(200) creates a promise that will fulfill in 200ms, 
// and then we return that from the first then(..) fulfillment callback, 
// which causes the second then(..)’s promise to wait on that 200ms promise.

delay(100) // step1
  .then(function STEP2(t) {
    console.log(t)
    console.log('step 2 (after 100ms)');
    return delay(200);
  })
  .then(function STEP3(t) {
    console.log(t);
    console.log('step 3 (after another 200ms)')
  })
  .then(function STEP4(t) {
    console.log(t); // nothing returned previously, so it is undefined
    console.log('step 4 (next job)');
    return delay(50);
  })
  .then(function STEP5(t) {
    console.log(t);
  })

