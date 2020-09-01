// async behavior only gets you so far, because it’s still fundamentally bound to a single event loop thread.
// the browser provides multiple Web Workers (instances of the JS engine), each of which can run on its own thread.
// Web Workers let you run a JS file (aka program) in a separate thread using async events to message between the threads.


// instantiate a worker: must point to the location of a js file, which gets loaded to the worker
// The browser will then spin up a separate thread and let that file run as an independent program in that thread.
var w1 = new Worker("http://some.url.1/mycoolworker.js");


// web workers do not share any scopes or resources; instead have a messaging mechanism

// from outside the worker (main page):
/* have worker listen for events */
w1.addEventListener('message', function(evt) {
  // evt.data
});
/* send the 'message' event to the worker */
w1.postMessage('something cool to say');

// inside the worker, things are mirrored:
addEventListener('message', function(evt) {
  // evt.data
}) 
postMessage('a cool reply');
