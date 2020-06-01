const Rx = require('rxjs/Rx');
const WebSocket = require('websocket');
const websocket = new WebSocket('ws://localhost:1337');

// Listens for the ‘message’ events used to transmit messages between client and server
Rx.Observable.fromEvent(websocket, 'message')
  .map(msg => JSON.parse(msg.data)) // parses the JSON into object
  .pluck('msg') // reads the msg
  .subscribe(console.log);


/* simulating a hot observable
would be a problem if it Wraps the socket object after a three second delay  
Thus, if the socket opening occurs before the page has completed its initialization step, 
the observable will potentially miss any events emitted in the intervening period.


Rx.Observable.timer(3000)
  .mergeMap(() => Rx.Observable.fromEvent(websocket, 'message'))
  .map(msg => JSON.parse(msg.data))
  .pluck('msg').subscribe(console.log);
