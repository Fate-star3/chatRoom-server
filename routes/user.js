const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const passport = require('passport');
// const { createAvatar } = require('@dicebear/avatars')
// const style = require('@dicebear/avatars-male-sprites')
const User = require('../models/User');
const result = require('../common/constants')
const { secret } = require('../common/config');

// 用户头像风格
const styleOptions = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'croodles-neutral',
  'identicon',
  'initials',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art'
]
// 用户名称
const nameCollections = [
  '小邋遢',
  '酷到被通缉',
  '寻觅兔牙星',
  '痞子伯爵',
  '此号已废',
  '海风少女',
  '仙女不喝酒',
  '人间不值得',
  '桃子摇摇冰',
  '进错门错床',
  '花式撩妹王',
  '对方正在输入',
  '你何为不乐观',
  '回幼儿园当学霸',
  '蠢似猪',
  '小猪胖乎乎',
  '诺贝尔可爱奖',
  '爬范的容嬷嬷',
  '星星泡饭',
  '待我胡须及腰',
  '两包辣条约吗',
  '仙气女孩',
  '帅的被人追杀',
  '萌物猛于虎',
  '起床困难户',
  '淡淡的蛋疼',
  '酷到被通缉',
  '幼儿园一姐',
  '松栗奶羊',
  '智慧女孩要秃头',
  '山猪口服液',
  '可萌可猛づ',
  '舔奶盖的小仙女',
  '魔法少女',
  '动不动就胖了',
  '舔酸奶盖儿',
  '萝莉的烦躁期',
  '枕头说它不想醒',
  '爱情在招手',
  '短腿猪',
  '萌到发芽',
  '萌萌萌、萌丫头',
  '司马缸砸光',
  '奈何桥被了',
  '桃气小可爱',
  '风吹裤裆毛飞扬',
  '抹茶奶油卷',
  '草莓味的猪猪',
  '甜心萝卜',
  '考试什么一点都不酷',
  '幼稚鬼ε',
  '啦啦啦，我是卖萌的小行家',
  '哎喂',
  '其实我不笨只不过懒得聪明',
  '起床困难户',
  '待莪婚纱落地绊死祢可好',
  '心中的小鹿已撞死ぃ',
  '老师，我晕课',
  '国民男神经',
  '等死中',
  '怪咖',
  '众神经ε',
  '柔情似水似你妹',
  '脱下裤子',
  '人丑就要多读书'
]
// 用户身份
const identityCollections = [
  '学生',
  '研究生',
  '博士生',
  '教师',
  '副教授',
  '教授',
  '书记',
  '副书记',
  '学生会主席',
  '学生会副主席',
  '学生会成员',
  '导员',
  '校长',
  '副校长',
]

// 验证token
router.get('/test', passport.authenticate('jwt', { session: false })
  , (req, res, next) => {
    res.status(200).json({
      ...result.SuccessResultData,
      data: {
        id: req.user.id,
        name: req.user.name,
        account: req.user.account,
        email: req.user.email,
        avatar: req.user.avatar,
        identity: req.user.identity,
        date: req.user.date,
      }
    })
  })

// 搜索查询其他用户
router.get('/search', (req, res) => {
  const query = req.query.account
  const reg = new RegExp(query)
  User.find({ account: reg }).sort({ account: 1 }).then(user => {
    if (user) {
      res.status(200).json({
        ...result.SuccessResultData,
        data: user
      })
    }
  })
})



// 返回用户信息
router.get('/userInfo', (req, res, next) => {
  // var parseObj = url.parse(req.url, true)//获取的是url模块的parse方法
  const { account } = req.query
  User.findOne({ account: account })
    .then(user => {
      if (user) {
        res.json({
          ...result.SuccessResultData,
          data: user
        })

      } else {
        res.status(404).json('查询用户信息失败')
      }
    })
    .catch(err => log(err))


})


// @route  POST /user/register
// @desc   返回的请求的json数据
router.post('/register', (req, res) => {
  // 查询User数据集合中是否拥有邮箱
  User.findOne({ account: req.body.account }).then(user => {
    if (user) {
      return res.status(200).json({ ...result.ErrorResultData, message: '账号已被注册' });
    } else {
      // 随机生成头像 返回一个svg图片
      // const avatar = createAvatar(style, {
      //   seed: 'custom-seed',
      //   size: 35
      // });
      const avatar = `https://avatars.dicebear.com/api/${styleOptions[Math.floor(Math.random() * 17)]}/${req.body.account}.svg`
      // 用户对象
      const newUser = new User({
        name: nameCollections[Math.floor(Math.random() * 65)],
        account: req.body.account,
        avatar,
        password: req.body.password,
        identity: identityCollections[Math.floor(Math.random() * 14)],
        date: req.body.date
      });
      // 散列hash函数 信息加密
      bcrypt.genSalt(10, function (err, salt) {
        // 将加密后的密码替换用户密码
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err
          } else {
            newUser.password = hash;
            // 存储到数据库
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

// @route  POST /user/login
// @desc   返回token jwt passport
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
        // 1.用户输入账户和密码请求服务器
        // 2.服务器验证用户信息，返回用户一个token值
        // 接收的参数： 规则payload  秘钥secretKet   options  回调函数
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity,
          account: user.account,
          password: user.password,
          email: user.email,
          identity: user.identity,
          date: user.date,
        }
        jwt.sign(payload, secret, {
          expiresIn: 9999,//JWT Token 过期时间
          issuer: 'yyx',//JWT Token 的签发者，其值应为 大小写敏感的 字符串 或 Uri
          audience: 'qiqi',//接收 JWT Token 的一方
          // jwtid: '' //JWT Token ID，令牌的唯一标识符，通常用于一次性消费的Token
          // notBefore JWT Token 生效时间
        }, (err, token) => {
          if (err) throw err;
          res.json({
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
              token: 'Bearer ' + token
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

// 编辑用户信息
router.post('/update', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newUserInfo = {
      name: req.body.name,
      account: req.body.account,
      avatar: req.body.avatar,
      identity: req.body.identity,
    }
    console.log(req.body);
    User.findOneAndUpdate(
      { account: req.body.account },
      { $set: newUserInfo },
      // newUserInfo,
      { new: true }//如果为 true，则返回修改后的文档而不是原始文档
    )
      .then(user => {
        if (user) {
          res.status(200).json({
            ...result.SuccessResultData,
            data: user
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  })

// 删除用户信息 相当于注销账号
router.delete('/delete', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOneAndDelete({ account: req.body.account })
      .then(user => {
        console.log(user);
        if (user) {
          res.status(200).send('删除成功！')
        }
      })
      .catch(err => {
        res.status(404).json(err)
      })
  })
module.exports = router