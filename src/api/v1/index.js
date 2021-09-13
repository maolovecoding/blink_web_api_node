const classicRouter = require("./classic.js")
const bookRouter = require("./book.js");
const userRouter = require("./user");
const loginTokenRouter = require("./token")
const likeRouter = require("./like")

module.exports = {
  classicRouter,bookRouter,userRouter,loginTokenRouter,likeRouter
}