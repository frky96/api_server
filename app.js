const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: false }));

// router前 封装res.cc函数
app.use((req, res, next) => {
  res.cc = function(err, status = 1) {
    res.send({
      status,
      msg: err instanceof Error ? err.message : err,
    })
  }
  next()
})

const userRouter = require('./router/user');
app.use('/api', userRouter)

// router后 定义error级别middleware
const joi = require('joi');
app.use((err, req, res, next) => {
  // 验证失败的错误
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 未知错误
  res.cc(err);
})

app.listen(3007, () => {
  console.log('app is running at http://127.0.0.1:3007');
})