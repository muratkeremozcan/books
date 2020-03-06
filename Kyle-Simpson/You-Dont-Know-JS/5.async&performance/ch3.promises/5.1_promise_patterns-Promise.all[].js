// one pattern until now: Promise chains (this-then-this-then-that flow control)

// In classic programming terminology, a gate is a mechanism that waits on two or more parallel/concurrent tasks to complete
// in the Promise API this is Promise.all([..])

var p1 = request('http://some.url.1/');
var p2 = request('http://some.url.2/');


Promise.all([p1, p2])
  .then(function (msgs) {
    // both p1 and p2 are fulfilled
    return request(
      'http://some.url.3/?v=' + msgs.join(',')
    );
  })
  .then(function (msg) {
    console.log(msg);
  });


// Promise.all([ .. ]) expects a single argument, an array, consisting generally of Promise instances. 
// The promise returned from the Promise.all([ .. ]) call will receive a fulfillment message (msgs in this snippet) 
  // that is an array of all the fulfillment messages from the passed in promises, in the same order as specified (regardless of fulfillment order).

// Each value in the list is essentially passed through Promise.resolve(..) to make sure it’s a genuine Promise to be waited on,
// If any one of those promises is instead rejected, the main Promise.all([ .. ]) promise is immediately rejected,
