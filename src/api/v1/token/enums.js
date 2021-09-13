// 登录方式 枚举
const LoginType = {
  // 小程序
  USER_MINI_PROGRAM: 100,
  // 邮箱登录
  USER_EMAIL: 101,
  // 手机登录
  USER_MOBILE: 102,
  // 管理员邮箱登录方式
  ADMIN_EMAIL: 200,
  isThisType(type) {
    for (const k in this) {
      if (type == this[k]) return true
    }
    return false;
  }
}

module.exports = LoginType