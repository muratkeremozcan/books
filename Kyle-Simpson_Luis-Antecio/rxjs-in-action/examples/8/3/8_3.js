/**
 *  RxJS in Action
 *  Listing 8.3
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const websocket = new WebSocket('ws://localhost:1337');

// Listens for the ‘message’ events used to transmit messages between client and server
Rx.Observable.fromEvent(websocket, 'message')
  .map(msg => JSON.parse(msg.data))
  .pluck('msg')
  .subscribe(console.log);
