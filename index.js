const express = require('express'),
      app = express(),
      socketio = require('socket.io');

app.use(express.static('./public'));
const port = process.env.PORT || 4000
const server = app.listen(port, process.env.IP, () => {
  console.log('Server is running on port ' + port);
});

const io = socketio(server);

io.on('connect', socket => {
  socket.on('drumdown', key => {
    socket.broadcast.emit('drumdown', key);
  });
  socket.on('drumup', key => {
    socket.broadcast.emit('drumup', key);
  });
});