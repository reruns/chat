var socket = io();

var ch = new App.Chat(socket);

var getMessage = function() {
  return $('.message-box').val();
}

var sendMessage = function(event) {
  event.preventDefault();
  var text = getMessage();

  if (text.charAt(0) === '/') {
    ch.processCommand(text.slice(1));
  } else {
    ch.sendMessage(text);
  }
  $('.message-box').val('');
}

var displayMessage = function(message) {
  var $li = $('<li></li>');
  $li.append(document.createTextNode(message));
  $('.message-list').prepend($li);
}

$(document).ready(function() {
  $('form').on('submit', sendMessage);

  socket.on('message', function(data){
    var msg = data.user + ': '+ data.text;
    displayMessage(msg);
  });

  socket.on('roomList', function(data) {
    var $rooms = $('.room-list')
    $rooms.empty();
    for (var room in data) {
      var $room = $("<ul></ul>");
      for (var user in data[room]) {
        $room.append('<li class="user">'+data[room][user]+'</li>');
      }
      $room.prepend(room);
      $rooms.append($room);
    }
  });

  socket.on('nickChangeResult', function(data){
    //wat do?
  })
})
