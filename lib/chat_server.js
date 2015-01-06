var guestNumber = 1;
var nicknames = {};
var currentRooms = {};

createChat = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket) {

    //setup stuff
    guestNumber += 1;

    nicknames[socket.id] = 'guest_'+guestNumber;

    joinRoom(socket, 'lobby');

    handleNickChangeRequests(socket, io);
    handleRoomChangeRequests(socket, io);
    handleMessages(socket, io);
    handleDisconnection(socket, io);

    io.sockets.emit('roomList', getRoomData(io));
  })
}

var handleMessages = function(socket, io) {
  socket.on('message', function(data) {
    room = currentRooms[socket.id];
    io.to(room).emit('message', {
      user: nicknames[socket.id],
      text: data.text
    });
  });
}

//joining rooms
var joinRoom = function(socket, room) {
  console.log(room);
  socket.join(room);
  currentRooms[socket.id] = room;
}

//nickname changes
var handleNickChangeRequests = function(socket, io) {
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

    var room = currentRooms[socket.id];
    var prevName = nicknames[socket.id];
    nicknames[socket.id] = data.nick;
    io.to(room).emit('nickChangeResult', {
      success: true,
      prevName: prevName,
      name: data.nick
    });

    var message = prevName + ' is now known as ' + data.nick;
    io.to(room).emit('message', {
      user: 'system',
      text: message
    });

    io.sockets.emit('roomList', getRoomData(io));
  });
}

//room Changes
var handleRoomChangeRequests = function(socket, io) {
  socket.on('roomChangeRequest', function(data) {
    socket.leave(currentRooms[socket.id]);
    joinRoom(socket, data.room);
    io.sockets.emit('roomList', getRoomData(io));
  })
}

//disconnect teardown
var handleDisconnection = function(socket, io) {
  socket.on('disconnect', function() {
    io.emit('message', {
      user: 'server',
      text: 'rip '+ nicknames[socket.id]
    });
    delete nicknames[socket.id];
    io.sockets.emit('roomList', getRoomData(io));
  });
}

//build up the room list
var getRoomData = function(io) {
  var roomList = io.sockets.adapter.rooms;
  var roomData = {};
  for (var room in roomList) {
    if (io.sockets.connected[room]) continue;

    roomData[room] = [];
    for(var socket in roomList[room]){
      roomData[room].push(nicknames[socket]);
    }
  }
  return roomData;
}

module.exports = createChat;
