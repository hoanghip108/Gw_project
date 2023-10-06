module.exports = function (io) {
  global.onlineUsers = new Map();

  io.on('connection', function (socket) {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(onlineUsers);
    });
    global.chatSocket = socket;
    console.log('A user connected', socket.id);
    socket.on('send-msg', (data) => {
      console.log('this is data: ', data);
      console.log('this is online user: ', onlineUsers);
      console.log('this is data to: ', data.to);
      const sendUserSocket = onlineUsers.get(data.to);
      console.log('this is send: ', sendUserSocket);
      if (sendUserSocket) {
        console.log('send msg: ', data.msg);
        socket.to(sendUserSocket).emit('msg-recieve', data.msg);
      }
    });

    socket.on('chat message', function (msg) {
      io.emit('chat message', msg);
    });
  });
};
