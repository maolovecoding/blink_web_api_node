const routers = require("../api/v1");
class InitManager {
  constructor(app) {
    this.app = app;
    this.init();
    // this.initDatabase();
  }
  /**
   * 初始化时需要做的工作
   *
   * @memberof InitManager
   */
  init() {
    const config = require("../config");
    // 将配置加载到全局对象上
    global.config = config;
  }
  /**
   * 初始化数据库表 同步所有表
   *
   * @memberof InitManager
   */
  initDatabase() {
    // require('../models/user');
  }
  /**
   *加载所有路由的初始化方法
   *
   * @memberof InitManager
   */
  initLoadRouters() {
    for (const router in routers) {
      this.app.use(routers[router].routes());
    }
  }
  initLoadListener(port) {
    this.app.listen(port, () => {
      console.log(`app is running at http://localhost:${port}`);
    });
  }
}

module.exports = InitManager;
