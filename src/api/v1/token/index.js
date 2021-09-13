// 生成token
const Router = require('koa-router');
const { ParameterException } = require('../../../core/exception/http-exception');
const { TokenValidator, NotEmptyValidator } = require('../../../core/validators/validator');
const { User } = require('../../../models');
const { generateToken } = require('../../../utils');
const { WxManager } = require("../../../core/service")
const LoginType = require('./enums');
const { Auth } = require('../../../middlewares');
const router = new Router({
  prefix: "/v1/token"
});

// 获取token
router.post("/", async (ctx) => {
  const v = await new TokenValidator().validate(ctx);
  // 判断登录类型
  let token;
  switch (v.get("body.type")) {
    // 小程序接口
    case LoginType.USER_MINI_PROGRAM:
      token = await WxManager.codeToToken(
        v.get("body.account"));
      break;
    case LoginType.USER_EMAIL: // 邮箱 密码登录
      token = await emailLogin(
        v.get("body.account"),
        v.get("body.secret")
      );
      break;
    case LoginType.USER_MOBILE:
      throw new ParameterException("接口还未设计！");
      break;
    case LoginType.ADMIN_EMAIL:
      throw new ParameterException("接口还未设计！");
      break;
    default:
      throw new ParameterException("type 异常！");

  }
  ctx.body = {
    token
  }
});

// 验证token是否有效的请求
router.post("/verify", async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx);
  const result = await Auth.verifyToken(v.get("body.token"));
  ctx.body = {
    result: result
  }
})

/**
 * 账户 密码 登录
 *
 * @param {string} account 账号（邮箱）
 * @param {string} secret 密码
 * @return {string} token
 */
async function emailLogin(account, secret) {
  const user =
    await User.verifyEmailPassword(account, secret);
  // 验证成功 生成token
  return generateToken(user.id, 8);
}

module.exports = router;