const express = require('express');
const router = express.Router();

const userinfo_handler = require('../router_handler/userinfo');

const expressJoi = require('@escook/express-joi');
const { update_userinfo_schema, update_Password, update_Avatar } = require('../schema/user');

router.get('/userinfo', userinfo_handler.getUserInfo);

router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateInfo);

router.post('/updatepwd', expressJoi(update_Password), userinfo_handler.updatePassword)

router.post('/update/avatar', expressJoi(update_Avatar), userinfo_handler.updateAvatar)

module.exports = router;