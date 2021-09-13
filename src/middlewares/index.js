// 全局异常处理 自定义的中间件
const {catchError} = require("./exception");
const Auth = require("./auth")
module.exports = {
  catchError,Auth
}