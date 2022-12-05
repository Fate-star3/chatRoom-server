const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methods = require('./common/methods')

mongoose
  .connect('mongodb://localhost:27017/user')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const { Server } = require("socket.io");
const io = new Server(server, { cors: true });


const route = require('./routes/index')
const userRoute = require('./routes/user')


// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 挂载路由

app.use(route)
app.use('/user', userRoute)
app.use(methods());


// 引入socket
require('./routes/socket.js')(io)

// process.env.PORT：读取当前目录下环境变量port的值
const port = process.env.PORT || 8000;

// 启动服务器
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});