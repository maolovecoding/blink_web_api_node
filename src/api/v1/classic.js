/*
 * @Author: 毛毛 
 * @Date: 2021-09-11 09:21:01 
 * @Last Modified by: 毛毛
 * @Last Modified time: 2021-09-15 17:52:13
 */
const Router = require("koa-router");
const { ParameterException } = require("../../core/exception/http-exception.js");
const { PositiveIntegerValidator, ClassicValidator } = require("../../core/validators/validator.js");
const { Auth } = require("../../middlewares");
const Flow = require("../../models/flow.js");
const { Art, Favor } = require("../../models");
const { USER_LEVEL } = require("./auth");
const { NotFound } = require("http-errors");
const router = new Router({
  prefix: "/v1/classic"
});
// 监听用户请求
/* m是中间件，就是验证token用的函数 */
router.get("/latest", new Auth(USER_LEVEL).m, async (ctx, next) => {
  // 获取路径参数
  // const path = ctx.params;
  // // 获取查询参数
  // const query = ctx.request.query;
  // // 获取请求头
  // const headers = ctx.request.header;
  // // 获取请求体
  // const body = ctx.request.body;
  // 参数校验
  // 校验数据
  // const v = await new PositiveIntegerValidator().validate(ctx);
  // v.validate(ctx);

  // 通过参数校验器 可以拿到任何参数 默认会自动转型
  // console.log(v.get("path.id"));
  // index = 8;
  const flow = await Flow.findOne({
    // 倒叙排列
    order: [
      ['index', "desc"]
    ]
  });
  const art = await Art.getData(flow.art_id, flow.type);
  // art 是一个类对象 这个涉及到JSON返回值序列化的问题
  // art里面的值由很多，这是一个模型
  // 我们实际上从表中查到的数据，都在dataValues这个属性下面
  // 往模型中添加一个键值对数据
  art.setDataValue("index", flow.index);
  // TODO koa框架，在返回值进行JSON序列化的时候，会自动序列化dataValues里面的属性
  // 其他的属性值不会进行序列化 也就是不会返回给前端
  const likeLatest = await Favor.userLikeIt(
    flow.art_id, flow.type, ctx.auth.uid);
  art.setDataValue('like_status', likeLatest);
  
  ctx.body = art;
  // 返回值
  // ctx.body = { };
});


// 获取指定期刊的下一期
router.get("/:index/next", new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  });
  const index = v.get('path.index');
  const flow = await Flow.findOne({
    where: {
      index: index + 1
    }
  });
  if (!flow) {
    throw new NotFound();
  }
  const art = await Art.getData(flow.art_id, flow.type);
  const likeNext = await Favor.userLikeIt(flow.art_id, flow.type);
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likeNext);
  ctx.body = art;
});

// 获取指定期刊的上一期
router.get('/:index/previous', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })

  const index = v.get('path.index');
  const flow = await Flow.findOne({
    where: {
      index: index - 1
    }
  });
  if (!flow) {
    throw new NotFound();
  }

  let art = await Art.getData(flow.art_id, flow.type);
  const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);

  art.setDataValue('index', flow.index);
  art.setDataValue('like_status', likePrevious);

  ctx.body = art;
})


// 返回某个classic的具体信息的路由接口
router.get("/:type/:id/favor", new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx);
  // 取出路径参数
  const id = v.get("path.id");
  // type已经被转为整形了
  const type = v.get("path.type");
  // 获取数量 fav_nums
  // const art = await Art.getData(id, type);
  // if (!art) {
  //   throw new NotFound();
  // }

  // const like = await Favor.userLikeIt(id, type, ctx.auth.uid);
  // ctx.body = {
  //   fav_nums: art.fav_nums,
  //   // 是否点赞
  //   like_status: like
  // }
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  ctx.body = {
    fav_nums: artDetail.art.fav_nums,
    like_status: artDetail.like_status
  };
})

// 获取用户喜欢的列表
router.get("/favor", new Auth().m, async ctx => {
  const uid = ctx.auth.uid;
  ctx.body = await Favor.getMyClassicFavors(uid);
})

// 获取一个期刊的详细信息
router.get("/:type/:id", new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx);
  // 取出路径参数
  const id = v.get("path.id");
  // type已经被转为整形了
  const type = v.get("path.type");
  // 获取数量 fav_nums
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  artDetail.art.setDataValue("like_status", artDetail.like_status);
  // ctx.body = {
  //   art: artDetail.art,
  //   like_status: artDetail.like_status
  // };
  ctx.body = artDetail.art;
});


module.exports = router;

