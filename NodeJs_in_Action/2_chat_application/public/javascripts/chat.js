var Chat = function(socket) {
  // a class that takes a Socket.IO socket when instantiated
  this.socket = socket;
};
Chat.prototype.sendMessage = function(room, text) {
  // function to send chat messages
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};
Chat.prototype.changeRoom = function(room) {
  // function to change rooms
  this.socket.emit('join', {
    newRoom: room
  });
};
Chat.prototype.processCommand = function(command) {
  // function to process chat commands
  var words = command.split(' ');
  var command = words[0].substring(1, words[0].length).toLowerCase(); // parse command from first word https://devdocs.io/javascript/global_objects/string/substring
  var message = false;

  switch (command) {
    case 'join': // handle room changing/creating
      words.shift();
      var room = words.join(' '); // https://devdocs.io/javascript/global_objects/array/join
      this.changeRoom(room);
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name); // handle name change attempts
      break;
    default:
      message = 'Unrecognized command.'; // return error message if command isn't recognized
      break;
  }
  return message;
};
