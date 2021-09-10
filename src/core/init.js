const routers = require("../api/v1");
class InitManager {
  constructor(app) {
    this.app = app;
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
  initLoadListener(port){
    this.app.listen(port, () => {
      console.log(`app is running at http://localhost:${port}`);
    });
  }
}

module.exports = InitManager;
