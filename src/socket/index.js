import app from '../server.js';
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  console.log('a user connected');
});
server.listen(5000, () => {
  console.log('listening on *:5000');
});
