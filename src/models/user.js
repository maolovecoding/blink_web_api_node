// 密码加密
const bcrypt = require("bcryptjs");

// 数据库对象
const db = require("../core/db");

const { DataTypes, Model } = require("sequelize");
const { AuthFailed } = require("../core/exception/http-exception");

// 定义模型
class User extends Model {
  /**
   * 邮箱密码登录验证
   *
   * @static 静态
   * @async 异步
   * @param {*} email 邮箱
   * @param {*} plainPassword 未加密的密码
   * @memberof User
   * @returns {User} 验证成功后的用户信息
   */
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      // 不存在该用户
      throw new AuthFailed("用户不存在！");
    }
    // 进行密码加密后和数据库原密码进行比对
    // 直接将当前密码 和 数据库密码用compare方法进行比较即可
    const correct = await bcrypt.compare(plainPassword, user.password);
    if (!correct) {
      // 密码不正确
      throw new AuthFailed("密码不正确！");
    }
    // 验证正确
    return user;
  }
  /**
   * 查询openid
   * 
   * @static
   * @param {*} openid 小程序提供的openid
   * @memberof User
   */
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    });
    return user;
  }
  /**
   * 新增微信小程序用户
   *
   * @static
   * @param {*} openid 
   * @memberof User
   */
  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
}
User.init({ // 在这里定义模型属性
  // 属性：类型 =》 数据库表字段：类型
  id: {
    type: DataTypes.INTEGER,
    // 设置为主键
    primaryKey: true,
    // 自增
    autoIncrement: true
  },
  nickname: DataTypes.STRING,
  email: DataTypes.STRING,
  password: {
    type: DataTypes.STRING(64),
    // model的属性操作 直接将需要加密的密码都写在set函数中
    set(val) {// 观察者模式（就是）
      // 密码加密 参数 表示生成这个salt需要花费的成本
      // 成本越高，花费的时间越多
      const salt = bcrypt.genSaltSync(10);
      const pwd = bcrypt.hashSync(val, salt);
      // 指定给那个字段赋值
      this.setDataValue("password", pwd);
    }
  },
  // 微信生成的用户id
  openid: {
    type: DataTypes.STRING(64),
    unique: true
  }
}, {
  // 这是其他模型参数
  sequelize: db, // 我们需要传递连接实例
  modelName: 'user' // 我们需要选择模型名称
});

module.exports = User;