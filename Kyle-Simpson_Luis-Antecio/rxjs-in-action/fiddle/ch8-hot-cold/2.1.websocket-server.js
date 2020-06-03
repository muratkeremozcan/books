const Rx = require('rxjs/Rx');
const WebSocketServer = require('websocket').server;
const http = require('http');


// Aside from binding to DOM events and AJAX calls, RxJS can bind to WebSockets. 
// WebSocket (WS) is an asynchronous communication protocol, faster & more efficient than HTTP (which is only request & response)
// advantage 1: information can be passed back and forth while keeping the connection open
// advantage 2: servers can send content to the browser without the browser explicitly requesting it.

// using websocket APIs the client can send messages to a server and receive event-driven responses (server push) 
// without having to explicitly poll for data, which is what the client would do with regular HTTP requests.

// ex: live chats, streaming services, games

// the first step of communication between the client and the server is critical.
// the client sends a GET request containing a secure key and instructions for the server 
// to attempt to upgrade to a message-based WebSocket connection (from HTTP). 
// If the server understands WebSocket, it will respond with a unique hash confirming the protocol upgrade.


// instantiate HTTP server to begin listening on port 1337
// ws port:
const server = http.createServer();
server.listen(1337);

// create the websocket server
const wsServer = new WebSocketServer({
  httpServer: server
});

// reacts to the 'request' event received (from the client)
Rx.Observable.fromEvent(wsServer, 'request')
  .map(request => request.accept(null, request.origin))
  .subscribe(connection => {
    // once connection is established, sends a JSON packet
    connection.sendUtf(JSON.stringify({ 
      msg: 'Hello Socket'
    }));
  });