var guestNumber = 1;
var nicknames = {};

createChat = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    guestNumber += 1;

    nicknames[socket.id] = 'guest_'+guestNumber;

    io.emit('message', {
      user: 'server',
      text: 'GIRD YOUR LOINS, '+ nicknames[socket.id] +' HAS ARRIVED.'
    })

    //send a message
    socket.on('message', function(data) {
      io.emit('message', {
        user: nicknames[socket.id],
        text: data.text
      });
    });

    //changing nicknames
    socket.on('nickChangeRequest', function(data) {
      for (var key in nicknames) {
        var n = nicknames[key];
        if (data.nick === n) {
          socket.emit('nickChangeResult', {
            success: false,
            message: 'Name already taken'
          });
          return;
        }
      }

      nicknames[socket.id] = data.nick;
      socket.emit('nickChangeResult', {
        succes: true,
        message: 'Name changed'
      });
    });

    socket.on('disconnect', function() {
      guestNumber--;
      io.emit('message', {
        user: 'server',
        text: 'rip '+nicknames[socket.id]
      });
      delete nicknames[socket.id];
    });

  })
}

module.exports = createChat;
