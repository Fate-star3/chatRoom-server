var jwt = require('jsonwebtoken');

const userInfo = {
  name: 'aaa',
  id: 1,
  anth: 'admin'
}

const key = '1111'

var token = jwt.sign(userInfo, key, {
  algorithm: RSA,
  expiresIn: 2,

},);

// console.log(token)

const info = jwt.decode(token)

console.log(info)

setTimeout(() => {
  try {
    const verify = jwt.verify('asdasda', key)
    console.log(verify)
  } catch (error) {
    console.log(error.message)
  }
}, 3000)