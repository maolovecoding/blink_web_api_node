const basicAuth = require("basic-auth");
const jwt = require('jsonwebtoken');
const { security } = require("../config");
const { Forbidden } = require("../core/exception/http-exception")
class Auth {
  /**
   * 
   * Creates an instance of Auth.
   * @param {*} level 权限等级
   * @memberof Auth
   */
  constructor(level) {
    this.level = level || 1;

  }
  /**
   * 三种权限
   *
   * @static
   * @memberof Auth
   */
  static USER = 8;
  static ADMIN = 16;
  static SUPER_ADMIN = 32;
  /**
   * token 验证中间件
   *
   * @readonly
   * @memberof Auth
   */
  get m() {
    return async (ctx, next) => {
      // token 检测
      // HttpBasicAuth
      // 通过header传递
      const userToken = basicAuth(ctx.req); // req 是nodejs原生的request
      if (!userToken || !userToken.name) {
        // token不存在
        throw new Forbidden("token 不存在！");
      }
      // 解码后的token
      let decodeToken;
      try {
        // 校验token
        decodeToken = jwt.verify(userToken.name, security.secretKey);
      } catch (error) {
        // token 过期
        if (error.name == "TokenExpiredError") {
          throw new Forbidden("token 过期了")
        }
        // token 不合法
        throw new Forbidden("token 不合法！");
      }
      // 权限校验
      if (decodeToken.scope < this.level) {
        throw new Forbidden("权限不足！");
      }
      // token 合法
      ctx.auth = {
        uid: decodeToken.uid,
        scope: decodeToken.scope
      }
      // 放行 
      await next();
    }
  }
  /**
   * token 是否有效
   *
   * @static
   * @param {*} token
   * @memberof Auth
   * @return {boolean} true表示令牌合法且可用
   */
  static async verifyToken(token) {
    try {
      jwt.verify(token, security.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = Auth;