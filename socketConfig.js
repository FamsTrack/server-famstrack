const io = require('socket.io')()

io.on('connection', socket => {
  console.log('Socket.io client connected!');
})

module.exports = io