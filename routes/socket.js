module.exports = function (io) {
  // socket连接
  io.on('connection', (socket) => {
    console.log('socket 连接成功！');

    // 接受信息
    socket.on('chat message', (data) => {
      console.log('data', data);
      // 广播信息
      socket.broadcast.emit('global message', data)
    })
    // 连接断开
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}