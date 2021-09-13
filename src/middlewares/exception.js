const { HttpException } = require("../core/exception/http-exception");

// 全局捕获异常
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // 判断环境 是否打印异常堆栈信息
    if (global.config.environment==="dev" && !(error instanceof HttpException)) throw error;
    // 错误信息 
    if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      // HTTP Status Code 状态码
      ctx.status = error.code;
    } else {
      // 处理未知异常
      ctx.body = {
        msg: "未知异常，服务器内部错误~~~~",
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500;
    }
  }
}

module.exports = {
  catchError
}