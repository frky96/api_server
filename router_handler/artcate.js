const db = require('../db/index');

exports.getArticleCates = (req, res) => {
  const sql = 'select * from ev_article_cate where is_delete=0 order by id asc';
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      msg: 'success get article cates',
      data: results
    })
  })
}

exports.addArticleCates = (req, res) => {
  const sql1 = 'select * from ev_article_cate where name=? or alias=?';
  db.query(sql1, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 2) return res.cc('name and alias has been used');
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('name and alias has been used');
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('name has been used');
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('alias has been used');
    const sql2 = 'insert ev_article_cate set ?';
    db.query(sql2, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('fail insert article cate');
      res.cc('success insert article cate', 0);
    })
  })
}

exports.deleteCateById = (req, res) => {
  const sql = 'update ev_article_cate set is_delete=1 where id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('fail delete article cate');
    res.cc('success delete article cate', 0)
  })
}

exports.getArtCateById = (req, res) => {
  const sql = 'select * from ev_article_cate where id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('fail get article cate');
    res.cc({
      status: 0,
      msg: 'success get article cate',
      data: results[0],
    })
  })
}

exports.updateArtCateById = (req, res) => {
  const sql1 = 'select * from ev_article_cate where id!=? and (name=? or alias=?)';
  db.query(sql1, [req.body.id, req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 2) return res.cc('name and alias has been used');
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('name and alias has been used');
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('name has been used');
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('alias has been used');
    const sql2 = 'update ev_article_cate set name=?, alias=? where id=?';
    db.query(sql2, [req.body.name, req.body.alias, req.body.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('fail update article cate');
      res.cc('success update article cate', 0)
    })
  })
}
