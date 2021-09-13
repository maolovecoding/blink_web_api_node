const { Model, DataTypes } = require("sequelize");
const db = require("../core/db");

// 定义一些共有的属性字段
const classicFields = {
  // 图片
  image: DataTypes.STRING,
  // 内容
  content: DataTypes.STRING,
  // 出版时间
  pubdate: DataTypes.DATEONLY,
  // 喜欢的数量
  fav_nums: DataTypes.INTEGER,
  // 标题
  title: DataTypes.STRING,
  // 类型
  type: DataTypes.INTEGER,
  // 状态
  status: DataTypes.SMALLINT(6)
}
/**
 * 音乐实体model
 *
 * @class Movie
 * @extends {Model}
 */
class Movie extends Model { }
// 构建实体类
Movie.init(classicFields, {
  sequelize: db,
  // 表名
  tableName: "movie"
});
/**
 *  句子实体类 model
 *
 * @class Sentence
 * @extends {Model}
 */
class Sentence extends Model { }
Sentence.init(classicFields, {
  sequelize: db,
  tableName: "sentence"
})
/**
 * 音乐实体类
 *
 * @class Music
 * @extends {Model}
 */
class Music extends Model { }
// 多了一个url字段 表示音乐地址
Music.init(Object.assign({
  url: DataTypes.STRING
}, classicFields), {
  sequelize: db,
  tableName: "music"
});

module.exports = {
  Music, Movie, Sentence
}
