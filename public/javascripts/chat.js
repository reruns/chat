(function(root){
  var App = root.App = (root.App || {});
  App.Chat = function(socket) {
    this.sock = socket;
  }

  App.Chat.prototype.sendMessage = function(text) {
    this.sock.emit('message', {text: text});
  }

  App.Chat.prototype.processCommand = function(com) {
    var args = com.split(' ');
    if (args[0] === 'nick') {
      this.sock.emit('nickChangeRequest', {nick: args[1]});
    } else {
      sendMessage('Command not recognized');
    }
  }
}(this));
