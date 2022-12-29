const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose');
const jwt = require('./utils/jwt')
const { dbUrl, port } = require('./common/config')

mongoose
  .connect(dbUrl)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const { Server } = require("socket.io");
const io = new Server(server, { cors: true });

// 首先公开指定目录
// 只要这样做了，你就可以直接通过/public/xx的方式访问 public目录中的所有资源了 只能一级一级往上查找，不能同级查询目录
app.use('/public/', express.static('./public/'))

const route = require('./routes/index')
const userRoute = require('./routes/user')

// passport 初始化
app.use(passport.initialize());

require('./common/passport')(passport);

// 使用body-parser中间件 body-parser已经加入了到了express中了，不需要引入第三方包
// 通过挂载express.urlencoded()内置中间件，可以解析表单中的url-encoede格式的数据
app.use(express.urlencoded({ extended: false }))
// 通过挂载express.json()内置中间件，可以解析json格式的表单数据
app.use(express.json())

// 挂载中间件
// app.use(jwt.verifyToken)

// 挂载路由
app.use(route)
app.use('/user', userRoute)



// 全局错误处理中间件
/**错误处理中间件始终采用四个参数。您必须提供四个参数才能将其标识为错误处理中间件函数。即使不需要使用该对象，也必须指定它以维护签名。否则，
 * 该对象将被解释为常规中间件，并且无法处理错误。顺序在最后 */
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// express框架中，默认不支持session和cookie  session数据是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把session进行持久化存储
// 所以我们使用第三方中间件来解决
// 可以通过req.session来访问和设置session成员 设置req.session.username = 'jack'   访问 req.session.username
// app.use(session({
//   secret: 'keyboard cat',//配置加密字符串，她会在原有的加密基础之上与这个字符串拼起来去加密 目的是为了增加安全性，防止客户端恶意伪造
//   resave: false,
//   saveUninitialized: true//无论你是否使用session，都默认分配一把钥匙
// }))


// 引入socket
require('./routes/socket.js')(io)


// 启动服务器
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});