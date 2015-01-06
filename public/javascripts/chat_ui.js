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
  $('.messages').prepend('<li>' + message + '</li>');
}

$(document).ready(function() {
  $('form').on('submit', sendMessage);

  socket.on('message', function(data){
    console.log(data);
    var msg = data.user + ': '+ data.text;
    displayMessage(msg);
  })

  socket.on('nickChangeResult', function(data){
    console.log(data);
  })
})
