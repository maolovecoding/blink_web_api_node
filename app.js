// 导入koa
const Koa = require("koa");
const static = require("koa-static");
const path = require("path")
// 自动注册路由的第三方库
// const requireDirectory = require("require-directory");

// 路由
// const { classicRouter, bookRouter } = require("./src/api/v1");

// 中间件
const parser = require("koa-bodyparser");
const { catchError } = require("./src/middlewares");

// 初始化对象
const InitManager = require("./src/core/init.js");
// 应用程序对象
const app = new Koa();
// 全局异常处理
app.use(catchError);
app.use(parser());
app.use(static(path.join(__dirname,"./static")));
// 端口
const port = 3000;

const initManager = new InitManager(app);

initManager.initLoadRouters();
// 启动监听
initManager.initLoadListener(port);





// 注册路由 将路由对象上的所有路由都注册到app上
// app.use(classicRouter.routes());
// app.use(bookRouter.routes());

// 启动服务 监听端口
// app.listen(port, () => {
//   console.log(`app is running at http://localhost:${port}`);
// })