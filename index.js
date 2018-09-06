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
  let activeRoom = 'general';
  socket.join('general');

  socket.on('room', join => {
    socket.leave(activeRoom);
    socket.join(join);
    activeRoom = join;
  });

  io.emit('clients', {global: io.engine.clientsCount });
  socket.on('disconnect', () => {
    io.emit('clients', {global: io.engine.clientsCount });
  });

  socket.on('drumdown', key => {
    socket.to(activeRoom).emit('drumdown', key);
  });
  socket.on('drumup', key => {
    socket.to(activeRoom).emit('drumup', key);
  });
});