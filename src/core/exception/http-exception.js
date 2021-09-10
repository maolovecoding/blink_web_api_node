// 定义异常类
/**
 * 全局请求异常基类
 *
 * @class HttpException
 * @extends {Error}
 */
class HttpException extends Error {
  /**
   * Creates an instance of HttpException.
   * 
   * @param {string} [msg="服务器异常"] 消息通知
   * @param {number} [errorCode=10000] 处理结果状态码
   * @param {number} [code=400] http状态码  code == status
   * @memberof HttpException 构造方法
   */
  constructor(msg = "服务器异常", errorCode = 10000, code = 400) {
    super();
    this.errorCode = errorCode;
    this.code = code;
    this.msg = msg;
  }
}
/**
 * 参数异常类
 *
 * @class ParameterException
 * @extends {HttpException}
 */
class ParameterException extends HttpException {
  /**
   * 参数类型错误 异常类
   * Creates an instance of ParameterException.
   * @param {string} [msg="参数类型错误！"] 错误消息
   * @param {number} [errorCode=10000] 错误状态码
   * @memberof ParameterException 参数异常构造方法
   */
  constructor(msg = "参数类型错误！", errorCode = 10000) {
    super(msg, errorCode, 400);
    // this.code = 400;
  }
}
/**
 *请求成功的返回的状态数据
 *
 * @class Success
 * @extends {HttpException}
 */
class Success extends HttpException {
  /**
   * Creates an instance of Success.
   * @param {string} [msg="success"] 
   * @param {number} [errorCode=0]
   * @param {number} [code=201]
   * @memberof Success
   */
  constructor(msg = "success", errorCode = 0, code = 201) {
    super(msg, errorCode, code);
  }
}

class NotFound extends HttpException {
  constructor(msg = "资源未找到", errorCode = 10000, code = 404) {
    super(msg, errorCode, code);
  }
}
/**
 * 未授权返回消息
 *
 * @class AuthFailed
 * @extends {HttpException}
 */
class AuthFailed extends HttpException {
  /**
   * Creates an instance of AuthFailed.
   * @param {string} [msg="授权失败！"]
   * @param {number} [errorCode=10004]
   * @param {number} [code=401]
   * @memberof AuthFailed
   */
  constructor(msg = "授权失败！", errorCode = 10004, code = 401) {
    super(msg, errorCode, code);
  }
}
/**
 *禁止访问返回值
 *
 * @class Forbidden
 * @extends {HttpException}
 */
class Forbidden extends HttpException {
  constructor(msg = "禁止访问", errorCode = 10006, code = 403) {
    super(msg, errorCode, code);
  }
}
/**
 * 重复点赞类消息返回
 *
 * @class LinkError
 * @extends {HttpException}
 */
class LinkError extends HttpException {
  constructor(msg = "你已经点赞过！", errorCode = 60001, code = 400) {
    super(msg, errorCode, code);
  }
}
/**
 *取消点赞成功类
 *
 * @class DislikeError
 * @extends {HttpException}
 */
class DislikeError extends HttpException {
  constructor(msg = "你已取消点赞", errorCode = 60002, code = 400) {
    super(msg, errorCode, code);
  }
}


module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbidden,
  LinkError,
  DislikeError,
};