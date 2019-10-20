// goal is to take a long-running “process” and break it up into steps or batches 
  // so that other concurrent “processes” have a chance to interleave their operations into the event loop queue.

var res = [];

// problem : one of the responses takes too long and hogs the event loop

// // `response(..)` receives array of results from the Ajax call
// function response(data) {
//   // add onto existing `res` array
//   res = res.concat(
//     // make a new transformed array with all `data` values doubled
//     data.map(function (val) {
//       return val * 2;
//     })
//   );
// }

// solution: can process these results in asynchronous batches, after each one yielding back to the event loop to let other waiting events happen.

// `response(..)` receives array of results from the Ajax call
function response(data) {
  // let's just do 1000 at a time
  var chunk = data.splice(0, 1000);

  // add onto existing `res` array
  res = res.concat (
    // make a new transformed array with all chunk values doubled
    chunk.map(function (val) {
      return val * 2;
    })
  );

  // anything left to process?
  if (data.length > 0) {
    // async schedule the next batch using 0 setTimeout: this way it goes to the back of the event loop
        // In Node.js, a similar approach is process.nextTick()

    setTimeout(function () {
      response(data);
    }, 0);

  }

}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", response);
ajax("http://some.url.2", response);
