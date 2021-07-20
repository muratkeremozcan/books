function delay (milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Date())
    }, milliseconds)
  })
}

// eslint-disable-next-line no-unused-vars
function leakingLoop () {
  return delay(1)
    .then(() => {
      console.log(`Tick ${Date.now()}`)
      return leakingLoop()
    })
}

// The solution to the problem is to break the chain of Promise resolution.
//  We can do that by making sure that the status of the Promise returned by leakingLoop()
//  does not depend on the promise returned by the next invocation of leakingLoop().
// eslint-disable-next-line no-unused-vars
function nonLeakingLoop () {
  delay(1)
    .then(() => {
      console.log(`Tick ${Date.now()}`)
      nonLeakingLoop()
    })
}

// eslint-disable-next-line no-unused-vars
function nonLeakingLoopWithErrors () {
  return new Promise((resolve, reject) => {
    (function internalLoop () {
      delay(1)
        .then(() => {
          console.log(`Tick ${Date.now()}`)
          internalLoop()
        })
        .catch(err => {
          reject(err)
        })
    })()
  })
}

// A third solution makes use of async/await. In fact, with async/await 
// we can simulate a recursive Promise chain with a simple infinite while loop,
// eslint-disable-next-line no-unused-vars
async function nonLeakingLoopAsync () {
  while (true) {
    await delay(1)
    console.log(`Tick ${Date.now()}`)
  }
}

// We should note that we would still have a memory leak if instead of a while loop, 
// we chose to implement the async/await solution with an actual asynchronous recursive step, such as the following
// eslint-disable-next-line no-unused-vars
async function leakingLoopAsync () {
  await delay(1)
  console.log(`Tick ${Date.now()}`)
  return leakingLoopAsync()
}

for (let i = 0; i < 1e6; i++) {
  leakingLoop()
  // nonLeakingLoop()
  // nonLeakingLoopWithErrors()
  // nonLeakingLoopAsync()
  // leakingLoopAsync()
}
