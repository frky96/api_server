const db = require('../db/index');
const bcrypt = require('bcryptjs');

exports.regUser = (req, res) => {
  const userinfo = req.body;
  console.log(userinfo);
  // 检测是否输入username&password
  // if (!userinfo.username || !userinfo.password) {
  //   return res.send({
  //     status: 1,
  //     msg: 'no empty username or password'
  //   })
  // }
  // username查重
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, [userinfo.username], (err, results) => {
    if(err) {
      return res.send({
        status: 1,
        msg: err.message
      })
    }
    if(results.length > 0) {
      return res.send({
        status: 1,
        msg: 'username has been used, change another one'
      })
    }
  })
  // 调用bcryptjs.hashSync()对password加密
  userinfo.password = bcrypt.hashSync(userinfo.password);
  // console.log(userinfo.password); 
  // mysql插入新用户
  const sql = 'insert into ev_users set ?';
  db.query(sql, {
    username: userinfo.username,
    password: userinfo.password
    }, (err, results) => {
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
  res.send('login ok');
}
