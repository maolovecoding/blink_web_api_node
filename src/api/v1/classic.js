const Router = require("koa-router");
const { ParameterException } = require("../../core/exception/http-exception.js");
const router = new Router();
// 监听用户请求
router.post("/v1/:id/classic/latest", async (ctx, next) => {
  // 获取路径参数
  const path = ctx.params;
  // 获取查询参数
  const query = ctx.request.query;
  // 获取请求头
  const headers = ctx.request.header;
  // 获取请求体
  const body = ctx.request.body;
  // 参数校验
  if (path) {
    const error = new ParameterException();
    // error.requestUrl = `${ctx.method} ${ctx.path}`;
    // 抛出异常
    throw error;
  }
  ctx.body = { path, query, headers, body };
});
module.exports = router;

