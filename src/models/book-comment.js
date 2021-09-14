// 书籍短评
const { Model, DataTypes } = require("sequelize");
const db = require("../core/db");

class Comment extends Model {
  /**
   * 新增书籍短评操作 给书籍点赞
   *
   * @static
   * @param {*} bookId 书籍id
   * @param {*} content 短评内容
   * @memberof Comment
   */
  static async addComment(bookId, content) {
    const comment = await Comment.findOne({
      where: {
        book_id: bookId,
        content
      }
    });
    // 评论不存在 则新增
    if (!comment) {
      return await Comment.create({
        book_id: bookId,
        content,
        nums: 1
      });
    } else {
      // 存在 更新短评的数量 加一
      return await comment.increment("nums", { by: 1 });
    }
  }
  /**
   * 获取书籍短评
   *
   * @static
   * @param {*} bookId 书籍id
   * @memberof Comment
   */
  static async getComment(bookId){
    const bookComments = await Comment.findAll({
      where:{
        id:bookId
      }
    });
    return bookComments;
  } 
}

Comment.init({
  content: DataTypes.STRING(256),
  nums: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  book_id: DataTypes.INTEGER
}, {
  sequelize: db,
  tableName: "comment"
})

module.exports = Comment;