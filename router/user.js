const express = require('express');
const router = express.Router();

const userHandler = require('../router_handler/user');

// 导入验证表单中间件
const expressJoi = require('@escook/express-joi');
const { reg_login_schema } = require('../schema/user');

// 注册新用户 先进行表单验证 若验证失败 抛出全局error
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser);

// 登录
router.post('/login', userHandler.login);




module.exports = router;