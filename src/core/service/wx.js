// wx小程序业务处理
const util = require("util");
const axios = require("axios");
const { wx } = require("../../config");
const { AuthFailed } = require("../exception/http-exception");
const { User } = require("../../models");
const { generateToken } = require("../../utils");
const { Auth } = require("../../middlewares");
class WXManager {
  static async codeToToken(code) {
    // 格式化 %s 是占位符
    const url = util.format(wx.loginUrl, wx.appId, wx.appSecret, code);
    // 发起请求
    const res = await axios.get(url);
    if (res.status !== 200) {
      throw new AuthFailed("openid 获取授权失败！");
    }
    // 请求成功则不会有错误码
    if (res.data.errcode) {
      // 获取失败
      throw new AuthFailed("openid 获取授权失败: " + res.data.errmsg + " + errcode = " + res.data.errcode);
    }
    // 获取的返回值合法 授权成功
    let user = await User.getUserByOpenid(res.data.openid);
    // 看用户是否存在库中
    if (!user) {
      // 不存在的话 需要新增到数据库中
      user = await User.registerByOpenid(res.data.openid);
    }
    // 返回生成的token  id 权限scope
    return generateToken(user.id, Auth.USER);
  }
}

module.exports = WXManager;