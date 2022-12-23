const qs = require('querystring')

// 功能类似于body-parser
const bodyParser = (req, res, next) => {
  let str = ''
  // 1.监听req的data事件，数据在传递就会触发这个事件函数
  // 数据可能会很大，需要切片传输，所以chunk是数据的一部分
  req.on('data', (chunk) => {
    str += chunk
  })
  // 2.监听req的end事件，当数据传输完毕，就会触发
  req.on('end', () => {
    const body = qs.parse(str)
    req.body = body
    next()
  })
}

module.exports = bodyParser
