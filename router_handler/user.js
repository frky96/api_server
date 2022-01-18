const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.regUser = (req, res) => {
  const userinfo = req.body;

  // username查重
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, [userinfo.username], (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        msg: err.message
      })
    }
    if (results.length > 0) {
      return res.send({
        status: 1,
        msg: 'username has been used, change another one'
      })
    }
  })

  // 调用bcryptjs.hashSync()对password加密
  userinfo.password = bcrypt.hashSync(userinfo.password);

  // mysql插入新用户
  const sql = 'insert into ev_users set ?';
  db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
    if (err) return res.send({
      status: 1,
      msg: err.message
    })
    if (results.affectedRows !== 1) return res.send({
      status: 1,
      msg: 'fail reg'
    })
    res.send({
      status: 0,
      msg: 'success reg'
    })
  })
}

exports.login = (req, res) => {
  const userinfo = req.body;

  // 查询mysql里是否有相应用户名
  const sql = 'select * from ev_users where username=?';
  db.query(sql, [userinfo.username], (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('fail login');
 
    // 判断密码是否正确
    const compareRusults = bcrypt.compareSync(userinfo.password, results[0].password);
    if (!compareRusults) return res.cc('fail login');

    // 登录成功生成token字符串（不包含敏感信息password&user_pic）响应给client
    const user = { ...results[0], password: '', user_pic: '' };
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
    res.send({
      status: 0,
      msg: 'success login',
      token: 'Bearer ' + tokenStr
    })
  })
}
