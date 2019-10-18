var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
  io = socketio.listen(server); // start socket.io server
  io.set('log level', 1);
  io.sockets.on('connection', function(socket) { // define how each connection will be handled
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // assign user a guest name when they connect
    joinRoom(socket, 'Lobby'); // place user in Lobby room when they connect
    handleMessageBroadcasting(socket, nickNames); // handle user messages, name and room changes
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);
    socket.on('rooms', function () { // upon user's request, provide a list of occupied rooms
      socket.emit('rooms', io.sockets.manager.rooms);
    });
    handleClientDisconnection(socket, nickNames, namesUsed); // cleanup logic when user disconnects
  });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber; // generate new guest name
  nickNames[socket.id] = name;
  socket.emit('nameResult', { // let user know their guest name
    success: true,
    name: name
  });
  namesUsed.push(name); // note that the name is now used
  return guestNumber + 1; // increment counter to generate guest names
}

function joinRoom(socket, room) { 
  socket.join(room); // make user join room
  currentRoom[socket.id] = room; //  note that the user is now in the room
  socket.emit('joinResult', {room: room}); // let user know they are now in the room
  socket.broadcast.to(room).emit('message', { // let other users know that the user has joined
    text: nickNames[socket.id] + ' has joined ' + room + '.' 
  });

  var usersInRoom = io.sockets.clients(room);
  if(usersInRoom.length > 1) { // if other users exist, summarize who they are
    var usersInRoomSummary = 'Users currently in room ' + room + ': ';
    for (var index in usersInRoom) { // determine what other users are in the same room
      var userSocketId = usersInRoom[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary}); // send summary of the other users in the room
  }
}
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) { // listener for nameAttempt events
    if(name.indexOf('Guest') == 0) { // do not allow names to begin with guest
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      if (namesUsed.indexOf(name) == -1) { // if name isn't already registered, register it
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex]; // remove previous name to make available to otehr clients
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
      } else { // if the name is already registered, send error
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}

function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}

function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}