function divEscapedContentElement(message) { // to display un-trusted text, transform text to HTML entries
  return $('<div></div>').text(message);
}
function divSystemContentElement(message) { // display trusted content created by the system
  return $('<div></div>').html('<i>' + message + '</i>');
}
function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) == '/') { // if the user input begins with a / command
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message); // broadcast non-command input to other users
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val('');
}
// logic to execute when the webpage has fully loaded
var socket = io.connect();

$(document).ready(function() {
  var chatApp = new Chat(socket);

  socket.on('nameResult', function(result) { // display results of a name-change attempt
    var message;

    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) { // display results of a room change
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', function (message) { // display received messages
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('rooms', function(rooms) { // display rooms available
    $('#room-list').empty();

    for(var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function() { // allow click of a room name to change to that room
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  setInterval(function() { // request a list of rooms available intermittently
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function() { // allow submitting the form to send a chat message
    processUserInput(chatApp, socket);
    return false;
  });
});
