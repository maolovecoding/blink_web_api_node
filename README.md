# web_node_api

[toc]

**前面是笔记，后面是 API 接口文档。**

[toc]

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve
```

### Compiles and minifies for production

```shell
npm run build
```

### Koa 的使用

#### 启动应用程序监听

```js
// 启动服务 监听端口
app.listen(port, () => {
  console.log(`app is running at http://localhost:${port}`);
});
```

#### 注册中间件

```js
app.use(fn(ctx,next)=>{});
```

use 方法进行注册中间件，koa 默认会给函数传递两个参数，一个参数是 ctx，一个参数是 next。
**ctx**就是 koa 中的上下文，**next**是一个函数，调用该函数应用程序就会往下执行，会去执行第二个，第三个..等其他中间件。
**中间件函数是一定有返回值的，我们可以自己指定返回值，且返回值会被包装为 promise 对象。**

##### ctx 上下文

可以将当前中间件的结果，传到上一个中间件里面。
我们将当前的结果 保存到 ctx 这个对象上面就行了。当时这种传值的方式，必须要保证洋葱模型的调用顺序。比如你在 next()函数调用之后才把数据挂载到 ctx 上，那么，你上一个中间件想要获取到这个结果，必然也需要在自己的 next()函数调用完成之后才可以获取到这个 ctx 上挂载的结果。

##### next 函数

调用 next 函数以后，就会立刻去执行下面的中间件函数，直到执行真正接口请求。然后会回来继续执行 next 函数后面的代码。但是是和请求接收的顺序是相反的。

```js
app.use((ctx, next) => {
  console.log(1);
  next();
  console.log(2);
});
app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
});
```

上面这段代码的执行结果就是 1 3 4 2.
这就是 Koa 的洋葱模型！
**为了保证洋葱模型，我们在使用 async/await 的时候，需要在每个中间件上都使用。不然一旦某个中间件使用后发生了线程的阻塞，就会切换到去执行其他线程。这样无法保证洋葱模型。**

### async/await

前面的 next()方法，调用后是有返回结果的，返回结果是一个 promise 对象。所以我们可以使用异步的终极解决方案 **async/await**。

```js
app.use(async (ctx, next) => {
  await next();
});
```

#### next()返回值

next()函数调用后的返回值，就是下一个中间件执行后的结果。

### 模型同步

User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.

### JSON 序列化

JSON 序列化一个对象，如果当前对象里面定义了 toJSON 函数，则是由该函数的返回值决定序列化后的值的。

```js
const obj = {
  name: "毛毛",
  age: 21,
  toJSON() {
    return {
      name: "张三",
    };
  },
};
```
