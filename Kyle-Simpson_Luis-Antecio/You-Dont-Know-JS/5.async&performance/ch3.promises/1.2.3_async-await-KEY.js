// same example from Ch4 generators 6.3

// powerful pattern: generators yielding Promises that then control the generator’s iterator to advance it to completion
// async await in ES7. Replaces the utility we wrote in 6.2

// The async function automatically knows what to do if you await a Promise 
// — it will pause the function (just like with generators) until the Promise resolves.
// Combines Promises with sync-looking flow control code.

function foo(x, y) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(x + y);
      }, Math.random() * 1000);

      setTimeout(function () {
        reject('rejector kicked in')
      }, 1600);

    });
}

// IMPORTANT: changed the generator function to async function
async function main() {
  try {
    // IMPORTANT await instead of yield
    var text = await foo(11, 31);
    return (text);
  }
  catch (error) {
    return (error);
  }
}

main(); //?
main(); //?
main(); //?


