const io = require('socket.io')(8800, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3001',
    // origin: 'http://www.eschoolhub.click',
    // credentials: true,
  },
});
