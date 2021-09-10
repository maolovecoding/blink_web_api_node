const Router = require("koa-router");
const router = new Router();

router.get("/v1/book/latest", async (ctx, next) => {
  ctx.body = {
    bookName:"mao"
  }
})

module.exports = router;