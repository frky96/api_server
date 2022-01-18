const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: false }));

const expressJWT = require('express-jwt');
const config = require('./config');
// 配置注册解析JWT的中间件
app.use(expressJWT({
  secret: config.jwtSecretKey,
  algorithms: ['HS256'],
}).unless({
  path: [/^\/api\//],
}));

// router前 封装res.cc函数
app.use((req, res, next) => {
  res.cc = function(err, status = 1) {
    res.send({
      status,
      msg: err instanceof Error ? err.message : err,
    })
  }
  next();
});


const userRouter = require('./router/user');
app.use('/api', userRouter);

const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);


// router后 定义error级别middleware
const joi = require('joi');
app.use((err, req, res, next) => {
  // 捕获验证失败的错误
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 捕获token认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('UnauthorizedError');
  // 未知错误
  res.cc(err);
})


app.listen(3007, () => {
  console.log('app is running at http://127.0.0.1:3007');
})