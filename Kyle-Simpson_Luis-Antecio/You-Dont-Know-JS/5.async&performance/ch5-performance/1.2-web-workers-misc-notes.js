// OTHER NOTES

// Usually the main page application creates the Workers, 
// but a Worker can instantiate its own child Worker(s) — known as subworkers

// To kill a Worker immediately from the program that created it, call terminate() on the Worker object

// If you have two or more pages (or multiple tabs with the same page!) in the browser that tries to create a Worker from the same file URL,
// those will actually end up as completely separate Workers.

// Web Workers do not have access to any of the main program’s resources; cannot access global variables or the page's DOM resources

// Web workers can perform network operations (Ajax, Websockets) and set timers. Workers also have access to navigator, location, JSON and applicationCache

// You can load JS scripts into your worker with ImportScripts(..). These are loaded synchronously; they will block the rest of the worker's 
// inside the worker
importScripts('foo.js', 'bar.js');


// workers can perform intensive math calculations
// can sort large data sets
// can perform data operations (compression, audio analysis, image pixel manipulations, etc.)
// can perform high traffic network communications

// all these use cases require a large amount of information to be transferred across the barrier between threads using the event mechanism

// a Structured Clone Algorithm is used to copy/duplicate the object on the other side.

// Another data transfer option is Transferable Objects. 
// What happens is that the object’s ownership is transferred, but the data itself is not moved. 
// Once you transfer away an object to a Worker, it’s empty or inaccessible in the the originating location 
// — that eliminates the hazards of threaded programming over a shared scope.
// Browsers that don’t support Transferable Objects simply degrade to structured cloning,

// `foo` is a `Uint8Array` for instance
/** The first parameter is the raw buffer and the second parameter is a list of what to transfer.*/
postMessage( foo.buffer, [ foo.buffer ] );
