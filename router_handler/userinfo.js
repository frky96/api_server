const db = require('../db/index');
const bcrypt = require('bcryptjs');

exports.getUserInfo = (req, res) => {
  const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?';
  // req.user（对象）里是expressjwt中间件解析好的用户数据
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('fail getUserInfo');
    res.send({
      status: 0,
      msg: 'success getUserInfo',
      data: results[0]
    })
  })
}

exports.updateInfo = (req, res) => {
  const sql = 'update ev_users set ? where id=?';
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('fail update');
    return res.cc('success update', 0);
  })
}

exports.updatePassword = (req, res) => {
  // 1.判断用户是否存在
  const sql1 = 'select * from ev_users where id=?';
  db.query(sql1, [req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('fail find user');
    // 2.查询旧密码是否正确
    const compareRusults = bcrypt.compareSync(req.body.oldPwd, results[0].password);
    if (!compareRusults) return res.cc('old password wrong');
    // 3.对新密码加密后更新到数据库
    const sql2 = 'update ev_users set password=? where id=?';
    const newPwd = bcrypt.hashSync(req.body.newPwd);
    db.query(sql2, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('fail update password');
      return res.cc('success update password', 0);
    })
  })
}

exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set user_pic=? where id=?';
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('fail update avatar');
    return res.cc('success update avatar');
  })
}