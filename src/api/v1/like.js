const Router = require("koa-router");
const { Success } = require("../../core/exception/http-exception");
const { LikeValidator } = require("../../core/validators/validator");
const { Auth } = require("../../middlewares");
const { Favor } = require("../../models");
const router = new Router({
  prefix: "/v1/like"
});
/*
点赞业务的实现接口
*/
router.post("/", new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, {
    // 给验证的参数字段起别名
    id: "art_id"
  });
  // uid不需要前端传递，因为我们token令牌验证以后，里面解析的有uid
  // 并且保存到了ctx.auth对象的属性下
  await Favor.like(v.get("body.art_id"),
    v.get("body.type"),
    ctx.auth.uid
  )
  // 成功
  throw new Success();
});

// 取消点赞的接口
router.post("/cancel", new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, {
    // 给验证的参数字段起别名
    id: "art_id"
  });
  // uid不需要前端传递，因为我们token令牌验证以后，里面解析的有uid
  // 并且保存到了ctx.auth对象的属性下
  await Favor.dislike(v.get("body.art_id"),
    v.get("body.type"),
    ctx.auth.uid
  )
  // 成功
  throw new Success();
});

module.exports = router;