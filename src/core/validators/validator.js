// 校验器

const LoginType = require("../../api/v1/token/enums");
const ArtType = require("../../api/v1/token/artType");
const { User } = require("../../models");
const { LinValidator, Rule } = require("../lin-validator");

/**
 * 整形数据校验器
 *
 * @class PositiveIntegerValidator
 * @extends {LinValidator}
 */
class PositiveIntegerValidator extends LinValidator {
  /**
   * 校验路径参数 id
   * 实例化过程：先调用super()执行父类的构造函数获取this，
   * 再复用父类实例化得到的this对象，
   * 进行加工加上自己定义的属性和方法，
   * 因此super必须放在constructor的第一行。
   * Creates an instance of PositiveIntegerValidator.
   * @memberof PositiveIntegerValidator
   */
  constructor() {
    // TODO 必须实例化父类 不然无法使用 this 
    super();
    // 可以定义多个规则
    this.id = [
      new Rule("isInt", "需要是正整数！", { min: 1 }),
    ]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [
      new Rule("isEmail", "不符合邮箱规范")
    ];
    this.password1 = [
      new Rule("isLength", "密码至少6个字符，最多32个字符", { min: 6, max: 18 }),
      new Rule("matches", "密码不符合规范", "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]")
    ]
    this.password2 = this.password1;
    this.nickname = [
      new Rule("isLength", "昵称至少1个字符，不超过8个字符", {
        min: 1,
        max: 8
      }),
    ]
  }
  /**
   * 验证两次密码是否一致
   *
   * @param {*} params 包含所有的参数（ctx）
   * @memberof RegisterValidator
   */
  validatePassword(params) {
    const password1 = params.body.password1;
    const password2 = params.body.password2;
    if (password1 !== password2) {
      throw new Error("两次密码不一致！");
    }
  }
  /**
   * 验证邮箱是否重复
   *
   * @param {*} params
   * @memberof RegisterValidator
   */
  async validateEmail(params) {
    const email = params.body.email;
    // 条件查询 根据条件查询一个满足要求的User模型
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (user) throw new Error("email 已存在！")
  }
}
/**
 * 生成Token令牌校验器
 *
 * @class TokenValidator
 * @extends {LinValidator}
 */
class TokenValidator extends LinValidator {
  constructor() {
    super();
    this.account = [
      new Rule("isLength", "不符合账号规则", { min: 4, max: 32 })
    ];
    // 密码 可以为空 可以不为空 
    // 为空 是通过其他方式进行验证
    this.secret = [
      new Rule("isOptional"),
      new Rule("isLength", "至少6个字符", { min: 6, max: 32 })
    ];
    // 登录方式校验
  }
  /**
   * 校验登录方式
   *
   * @param {*} params
   * @memberof TokenValidator
   */
  validateLoginType(params) {
    const t = params.body.type;
    if (!t) throw new Error("type是必填参数！");
    if (!LoginType.isThisType(t)) {
      // 类型不存在 
      throw new Error("type 参数不合法！");
    }
  }
}
/**
 *
 * 不允许为空 校验器
 * @class NotEmptyValidator
 * @extends {LinValidator}
 */
class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = [
      new Rule("isLength", "不允许为空", { min: 1 })
    ]
  }
}
/**
 * 点赞参数校验器
 *
 * @class LikeValidator
 * @extends {PositiveIntegerValidator}
 */
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkType
  }
}
function checkType(params) {
  const t = params.body.type;
  if (!t) throw new Error("type是必填参数！");
  if (!LoginType.isThisType(t)) {
    // 类型不存在 
    throw new Error("type 参数不合法！");
  }
}
/**
 * 获取具体详情数据的校验器
 *
 * @class ClassicValidator
 * @extends {LikeValidator}
 */
class ClassicValidator extends PositiveIntegerValidator {
  constructor() {
    super();
  }
  validateType(params) {
    let t = params.path.type;
    if (!t) throw new Error("type是必填参数！");
    t = Number.parseInt(params.path.type);
    if (!ArtType.isThisType(t)) {
      // 类型不存在 
      throw new Error("type 参数类型不合法！");
    }
    // 将原始type转为整形并保存了 外面还是通过 path.type获取
    this.parsed.path.type = t;
  }
}

class Checker {
  constructor(type) {
    this.checker = type;
  }
  checked(params) {
    let t = params.path.type;
    if (!t) throw new Error("type是必填参数！");
    t = Number.parseInt(params.path.type);
    if (!this.checker.isThisType(t)) {
      // 类型不存在 
      throw new Error("type 参数类型不合法！");
    }
    // 使用这种方式，type的类型没有发生改变 不会自动转型
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator
}