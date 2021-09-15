const { Model, DataTypes } = require("sequelize");
const { format } = require("util");
const axios = require("axios");
const db = require("../core/db");
const { yushu } = require("../config");
const Favor = require("./favor");
class Book extends Model {
  async bookDetail(id) {
    const url = format(yushu.detailUrl, id);
    console.log(url);
    // const detail = axios.get(url);
    // return detail.data;
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  }
  /**
   *
   *
   * @static
   * @param {*} q 关键字
   * @param {number} start 图书起始索引
   * @param {number} count 数量
   * @param {number} [summary=1] 概要信息 0 全部信息
   * @memberof Book
   */
  static async searchFromYuShu(q, start, count, summary = 1) {
    const url = format(yushu.keywordUrl, encodeURI(q), count, start, summary);
    console.log(url);
    const res = await axios.get(url);
    return res.data;
  }
  /**
   * 获取我喜欢的书籍数量
   *
   * @static
   * @param {*} uid 用户id
   * @memberof Book
   */
  static async getMyFavorCount(uid) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid
      }
    })
    return count;
  }
}
Book.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  fav_nums: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  sequelize: db,
  tableName: "book"
})

module.exports = Book;
