const {HttpException} = require("../core/exception/http-exception");

// 全局捕获异常
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // 错误信息 
    if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      // HTTP Status Code 状态码
      ctx.status = error.code;
    }
  }
}

module.exports = {
  catchError
}