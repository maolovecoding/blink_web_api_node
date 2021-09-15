// 配置文件
module.exports = {
  // 开发环境
  environment: "dev",
  database: {
    // 数据库
    database: "blink_web_api",
    // 用户名
    username: "root",
    password: "826427",
    // 端口 主机
    host: "localhost",
    port: 3306,
  },
  security: {
    // 自定义密匙 用来生成令牌
    secretKey: "^_^你好兄弟！-_-~_~-`-`",
    // 令牌的过期时间 单位是s
    expiresIn: 60 * 60 * 60
  },
  wx: {
    // 微信小程序的appid
    appId: "wx1c6b99ecb9cf8fd0",
    // 秘钥
    appSecret: "26cb51001becf36cf542e1831c24c97b",
    loginUrl: `https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code`
  },
  yushu: {
    detailUrl: 'http://t.yushu.im/v2/book/id/%s',
    keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s',
  },
  host:"http://localhost:3000/"
}