const jwt = require('jsonwebtoken');
const { secret } = require('../common/config');

const signToken = (payload) => {
    return jwt.sign(payload, secret, {
        expiresIn: 600 //单位是秒
    });
}

// // mustAdmin 是否必须是管理员才能访问
// const verifyToken = (mustAdmin) => (req, res, next) => {
//     // 取得客户端发过来的 token
//     let jwtToken = req.headers.Authorization;
//     if (jwtToken) {
//         jwt.verify(jwtToken, secret, (err, payload) => {
//             //1. token 验证失败
//             //2. 验证成功但是 token 过期了
//             if (err) {
//                 if (err.name === 'TokenExpiredError') {
//                     res.status(401).error('token已经过期');
//                 } else {
//                     res.status(401).error('token是无效的');
//                 }
//             } else {
//                 // 如果说要求必须管理员才能继续，那么还要看此登录的用户是不是管理员
//                 if (mustAdmin) {
//                     let { admin } = payload;
//                     if (admin) {
//                         next();
//                     } else {
//                         res.status(401).error('你不是管理员!无权执行此操作!');
//                     }
//                 } else {
//                     next();
//                 }
//             }
//         })
//     } else {
//         res.status(401).error('请提供jwtToken');
//     }
// };
const verifyToken = (req, res, next) => {
    // 取得客户端发过来的 token
    console.log(req.headers);
    let jwtToken = req.headers.authorization.slice(6)
    console.log(jwtToken);
    if (jwtToken) {
        jwt.verify('jwtToken', secret, (err, payload) => {
            //1. token 验证失败
            //2. 验证成功但是 token 过期了
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.statusCode = 401
                    res.end('token已经过期')
                    // res.status(401).error('token已经过期');
                } else {
                    res.statusCode = 401
                    res.end('token是无效的')
                    // res.status(401).error('token是无效的');
                }
            } else {
                console.log('payload', payload);
                const { identity } = payload
                if (identity !== '学生') {
                    next()
                } else {
                    res.statusCode = 401
                    res.end('你不是管理员!无权执行此操作!')
                    // res.status(401).error('你不是管理员!无权执行此操作!');
                }
            }
        })
    } else {
        res.statusCode = 401
        res.end('请提供jwtToken')
        // res.status(401).error('请提供jwtToken');
    }
};


module.exports = {
    signToken,
    verifyToken
};