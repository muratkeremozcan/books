'use strict';
const events = require('events'); // import events module for using event emitters
const net = require('net'); // net module provides an asynchronous network API for creating stream-based TCP/IPC servers or clients
const channel = new events.EventEmitter(); // create an event emitter object

// EVENT EMITTERS can fire/emit events. They can also handle/listen to events when they bind with eventHandlers/Listeners
// Fire an event
// eventEmitter.emit('eventName', [arg1], [arg2], [...])  // execute listener with the supplied argument(s));
// Handle/Listen to event by binding event and event handler/listener
// eventEmitter.on('eventName', eventHandler/Listener);

// https://www.tutorialspoint.com/nodejs/nodejs_event_emitter.htm   list of methods for EventEmitter class
// EE.emit(eventName, args)
// EE.setMaxListeners(n)
// EE.listeners(eventName)
// EE.removeAllListeners(eventName)

// EE.addListener(eventName, eventListener)
// EE.on(eventName, eventListener)
// EE.once(eventName, eventListener)
// EE.removeListener(eventName, eventListener)

channel.clients = {};
channel.subscriptions = {};

// eventEmitter.on('eventName', eventHandler/Listener);
channel.on('join', (id, client) => { // create a listener for join event
  // eventEmitter.listeners('eventName') // returns an array of listeners for the specified event
  var welcome = "Welcome!\n" + "Guests online: " + this.listeners('broadcast').length;
  // eventEmitter.setMaxListeners(n) // to set the max number of event listeners/handlers
  this.setMaxListeners(50);

  this.clients[id] = client; // store a user's client object to allow the application to send data back to the user
  this.subscriptions[id] = (senderId, message) => {
    if (id != senderId) { // ignore data if it's been directly broadcast by user
      this.clients[id].write(message);
    }
  };
  // eventEmitter.on('eventName', eventListener/Handler)
  this.on('broadcast', this.subscriptions[id]); // add a listener specific to the user for the broadcast event
});

// eventEmitter.on('eventName', eventListener/Handler)
channel.on('leave', id => { // create a listener for leave event
  // eventEmitter.removeListener('eventName', eventListener/Handler)
  channel.removeListener('broadcast', this.subscriptions[id]); // remove broadcast listener or specific event
  // EE.emit(eventName, args)
  channel.emit('broadcast', id, id + ' has left.\n');
});

channel.on('error', (err) => {
  console.log('ERROR: ' + err.message);
});

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`;

  // eventEmitter.emit('eventName', [arg1], [arg2], [...])  // execute listener with the supplied argument(s));
  channel.emit('join', id, client); // emit join event when a user connects, specifying the user id and client object

  // eventemitter.on('eventName', eventListener/Handler)
  client.on('data', data => { // when the user sends data
    data = data.toString();
    if(data === "shutdown\r\n") {
      channel.emit('shutdown');
    }
    // eventEmitter.emit('eventName', [args])
    channel.emit('broadcast', id, data); // emit a broadcast event specifying the user and message
  });

  // eventemitter.on('eventName', eventListener/Handler)
  client.on('close', () => { // emit leave event when client disconnects
    console.log('Client disconnected:', id);
    // eventEmitter.emit('eventName', [args])
    channel.emit('leave', id);
  });

  channel.on('shutdown', () => {
    channel.emit('broadcast', '', "Chat has shut down.\n");
    // removeAllListeners([event])
    channel.removeAllListeners('broadcast'); // remove all listeners of broadcast type
  });
});



server.listen(8888);