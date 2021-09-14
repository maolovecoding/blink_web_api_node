const Router = require("koa-router");
const { HotBook, Book, Comment } = require("../../models");
const { PositiveIntegerValidator, SearchValidator, AddShortCommentValidator } = require("../../core/validators/validator.js");
const { Auth } = require("../../middlewares");
const Favor = require("../../models/favor");
const { Success } = require("../../core/exception/http-exception");
const router = new Router({
  prefix: "/v1/book"
});

// 获取热门书籍数据
router.get("/hot_list", async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = {
    books
  }
});

// 获取指定书籍的详情信息
router.get("/:id/detail", async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = await new Book().bookDetail(v.get("path.id"));
  console.log(book);
  ctx.body = book;
});

// 图书搜索接口
router.get("/search", async (ctx) => {
  const v = await new SearchValidator().validate(ctx);
  const book = await Book.searchFromYuShu(
    v.get("query.q"), v.get("query.start"),
    v.get("query.count")
  );
  ctx.body = book;
});

// 获取我喜欢的书籍数量
router.get("/favor/count", new Auth().m, async (ctx) => {
  const count = await Book.getMyFavorCount(ctx.auth.uid);
  ctx.body = { count };
});

// 获取某个书籍的点赞情况
router.get("/:book_id/favor", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id"
  });
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get("path.book_id"));
  ctx.body = favor;
});

// 新增书籍短评
router.post("/add/short_comment", new Auth().m, async (ctx) => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: "book_id"
  });
  await Comment.addComment(v.get("body.book_id"), v.get("body.content"));
  // 成功 
  throw new Success();
});

// 获取书籍短评
router.get("/:book_id/short_comment", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id"
  });
  const comments = await Comment.getComment(v.get("path.book_id"));
  ctx.body = comments;
});

// 热搜  这里只是简单模拟
router.get("/hot_keyword", new Auth().m, async (ctx) => {
  ctx.body = {
    hot: [
      "Python",
      "哈利·波特",
      "村上春树",
      "东野圭吾",
      "白夜行",
      "韩寒",
      "金庸",
      "王小波",
      "听雨少年"
    ]
  }
});

module.exports = router;