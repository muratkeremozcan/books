'use strict';
const net = require('net'); // net module provides an asynchronous network API for creating stream-based TCP/IPC servers or clients

const server = net.createServer( (socket) => {  // creates a TCP/IP server
  // DELTA: the delta here is is responding once as opposed to responding repeatedly with socket.on
  socket.once('data', (data) => { // on receiving data
    socket.write(data); // data is written back to the client

  });
});

server.listen(8888);

// in cmd, run : telnet 127.0.0.1 8888