(function(root){
  var App = root.App = (root.App || {});
  App.Chat = function(socket) {
    this.sock = socket;
    this.room = 'lobby';
  }

  App.Chat.prototype.sendMessage = function(text) {
    this.sock.emit('message', {text: text});
  }

  App.Chat.prototype.processCommand = function(com) {
    var args = com.split(' ');

    switch(args[0]) {
      case 'nick':
        this.sock.emit('nickChangeRequest', {nick: com.slice(4)});
        break;
      case 'join':
        this.changeRoom(com.slice(4));
        break;
      default:
        sendMessage('Command not recognized');
    }
  }

  App.Chat.prototype.changeRoom = function(room) {
    this.room = room;
    this.sock.emit('roomChangeRequest', {room: room});
    this.sendMessage('Entering '+room);
  }
}(this));
