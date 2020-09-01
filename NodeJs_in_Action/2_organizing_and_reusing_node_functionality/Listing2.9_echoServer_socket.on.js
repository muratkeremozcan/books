'use strict';
const net = require('net'); // net module provides an asynchronous network API for creating stream-based TCP/IPC servers or clients

const server = net.createServer( (socket) => {  // creates a TCP/IP server
  // Whenever a client connects, a socket is created
  // the socket is an EVENT EMITTER to which we can add a listener using the ON method to respond to data events
  // EVENT EMITTERs fire events and can handle events when triggered
  // EVENT NAMEs are just keys and can be anything. There is only 1 special event 'error' .
  socket.on('data', (data) => { // on receiving data.
    socket.write(data); // data is written back to the client
  });
});

server.listen(8888);

// in cmd, run : telnet 127.0.0.1 8888