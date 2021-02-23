const io = require('socket.io')()

io.on('connection', socket => {
  socket.emit('halo', { name: 'message dari nanda untuk react native' })
  console.log('Socket.io client connected!');
})

module.exports = io