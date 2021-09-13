const Router = require("koa-router");
const { Success } = require("../../core/exception/http-exception");
const { RegisterValidator } = require("../../core/validators/validator");
const { User } = require("../../models");

const router = new Router({
  // 指定当前路由的前缀
  prefix: "/v1/user"
});

// 用户注册
router.post("/register", async ctx => {
  // 参数校验
  const v = await new RegisterValidator().validate(ctx);

  // 用户注册信息
  const user = {
    email: v.get("body.email"),
    nickname: v.get("body.nickname"),
    // 密码存储加密
    password: v.get("body.password1")
  }
  // 将信息保存到数据库
  await User.create(user);
  // 操作成功
  throw new Success();
})


// 用户


module.exports = router;

