const joi = require('joi');

const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
// 允许为空
const content = joi.string().required().allow('');
// 只允许是 已发布 或 草稿
const state = joi.string().valid('已发布', '草稿').required();

exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
}