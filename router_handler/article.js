const path = require('path');
const db = require('../db/index')

exports.addArticle = (req, res) => {
  console.log(req.file);
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('cover img is must');
  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename),
    pub_date: new Date(),
    author_id: req.user.id,
  }
  const sql = 'insert into ev_articles set ?';
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('fail add article');
    res.cc('success add article', 0);
  })
}