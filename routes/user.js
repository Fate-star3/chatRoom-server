const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const passport = require('passport');
const User = require('../models/User');
const result = require('../common/constants')
const { secret } = require('../common/config')
const { verifyToken } = require('../utils/jwt')

// express().use('/test', verifyToken)

router.get('/test', passport.authenticate('jwt', { session: false })
  , (req, res, next) => {

    res.json('添加成功')
    // console.log(req.headers);
    // verifyToken(req, res, next)
  })

router.get('/userInfo', (req, res, next) => {
  // var parseObj = url.parse(req.url, true)//获取的是url模块的parse方法
  // 返回用户信息
  const { account } = req.query
  User.findOne({ account: account }).then(user => {
    if (user) {
      res.json({
        ...result.SuccessResultData,
        data: user
      })

    } else {
      res.status(401).json('查询用户信息失败')
    }
  });

})


// @route  POST api/user/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
  // 查询User数据集合中是否拥有邮箱
  User.findOne({ account: req.body.account }).then(user => {
    if (user) {
      return res.status(200).json({ ...result.ErrorResultData, message: '账号已被注册' });
    } else {
      // 随机生成头像
      const avatar = gravatar.url(req.body.email, {
        s: '100',
        r: 'pg',
        d: 'monsterid'
      });

      // 用户对象
      const newUser = new User({
        name: req.body.name,
        account: req.body.account,
        avatar,
        password: req.body.password,
        identity: req.body.identity
      });
      // 散列hash函数 信息加密
      bcrypt.genSalt(10, function (err, salt) {
        // 将加密后的密码替换用户密码
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err
          } else {
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json({
                ...result.SuccessResultData,
                data: user
              }))
              .catch(err => console.log(err));
          }

        });
      });
    }
  });
});

// @route  POST api/user/login
// @desc   返回token jwt passport
// @access public
// 用户登录成功后，会返回一个token，这个token相对于一把钥匙，你拿到这把钥匙之后就可以去请求相应的数据，比如说你想拿到数据库里的信息就必须
// 带着这个钥匙（令牌）去拿。

router.post('/login', (req, res) => {
  const account = req.body.account;
  const password = req.body.password;
  // 查询数据库
  User.findOne({ account }).then(user => {
    if (!user) {
      if (password.length > 0) {
        res.status(200).json({ ...result.ErrorResultData, message: '用户不存在!' });
      }
      return

    }

    // 密码匹配
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        };
        // 1.用户输入账户和密码请求服务器
        // 2.服务器验证用户信息，返回用户一个token值
        // 接收的参数： 规则payload  秘钥secretKet   options  回调函数
        jwt.sign(payload, secret, {
          expiresIn: 9999,//JWT Token 过期时间
          issuer: 'yyx',//JWT Token 的签发者，其值应为 大小写敏感的 字符串 或 Uri
          audience: 'qiqi',//接收 JWT Token 的一方
          // jwtid: '' //JWT Token ID，令牌的唯一标识符，通常用于一次性消费的Token
          // notBefore JWT Token 生效时间
        }, (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            ...result.SuccessResultData,
            data: {
              id: user.id,
              name: user.name,
              account: user.account,
              password: user.password,
              email: user.email,
              avatar: user.avatar,
              identity: user.identity,
              date: user.date,
              token,
            }
          });
        });
      } else {
        if (password.length > 0) {
          return res.status(200).json({ ...result.ErrorResultData, message: '密码错误!' });
        }

      }
    });
  });
});


module.exports = router