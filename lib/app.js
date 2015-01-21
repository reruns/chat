var http = require('http'),
static = require('node-static');

var srv = require('./chat_server');

var file = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

server.listen(process.env.PORT || 8000);

var createChat = require('./chat_server.js')
createChat(server);
