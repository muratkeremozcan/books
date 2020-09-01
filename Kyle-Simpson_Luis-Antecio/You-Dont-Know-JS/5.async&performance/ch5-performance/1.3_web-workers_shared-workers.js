// SHARED WORKERS

// If your site allows multiple tabs of the same page and you want to reduce the resource usage (by preventing duplicate dedicated Web Workers)
// creating a SHARED WORKER that all the page instances of your site/app can share is useful
// (a common shared resource is socket network connection, limiting multiple connections from a client eases server resource requirements as well)

var w1 = new SharedWorker('http://some.url.1/mycoolworker.js');

// the worker needs to know which program a message comes from. This unique identification is called a port. 
// The calling program must use the port object of the Worker for communication
// at calling program:
w1.port.addEventListener('message', handleMessages);
w1.port.postMessage('something cool');

// Inside the shared Worker, an extra event must be handled: "connect". 
// This event provides the port object for that particular connection. 
// The most convenient way to keep multiple connections separate is to use closure over the port 
// with the event listening and transmitting for that connection defined inside the handler for the "connect" event:
// at worker:
addEventListener('connect', function(evt){ // function(evt) here is the event handler
  // the assigned port for this connection
  var port = evt.ports[0];

  port.addEventListener('message', function(evt){ // event listening
    // ..
    port.postMessage(/*..*/); // event transmitting
    // ..
  });

  // initialize the port connection
  port.start();
});

// Shared Workers survive the termination of a port connection if other port connections are still alive,
// whereas dedicated Workers are terminated whenever the connection to their initiating program is terminated.
