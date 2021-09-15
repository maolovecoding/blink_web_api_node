const { Model, DataTypes, Op, fn } = require("sequelize");
const db = require("../core/db");
const Favor = require("./favor");
// 热门书籍
class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      // 根据index进行排序
      order: ["index"]
    });
    const ids = [];
    books.forEach((book) => {
      ids.push(book.id);
    });
    // 获取每本书的点赞数量
    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids
        },
        type: 400
      },
      // 分组查询 根据书籍的 id 也就是 art_id 得到每本书的点赞数量即可
      group: ["art_id"],
      // 指定查询出来的结果包含哪些字段
      attributes: ["art_id", [fn("count", "*"), "count"]]
    });
    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors);
    })
    return books;
  }
  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get("count");
      }
    });
    book.setDataValue("fav_nums", count);
    return book;
  }
}

HotBook.init({
  // 书籍编号
  index: DataTypes.INTEGER,
  // 书籍封面图片地址
  image: DataTypes.STRING,
  // 作者
  author: DataTypes.STRING,
  // 书籍标题
  title: DataTypes.STRING,
  status: DataTypes.TINYINT
}, {
  sequelize: db,
  tableName: "hot_book"
});

module.exports = HotBook;