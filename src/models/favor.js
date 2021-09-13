const { NotFound } = require("http-errors");
const { Model, DataTypes, Op } = require("sequelize");
const db = require("../core/db");
const { LikeError, DislikeError } = require("../core/exception/http-exception");
const Art = require("./art");

// 业务表
/**
 * 记录用户是否对某个期刊进行点赞
 * TODO  大写的Favor 是模型，也是表 小写的favor，是实例化的Favor，可以理解为表中一个具体的数据
 * @class Favor
 * @extends {Model}
 */
class Favor extends Model {
  /**
   * 点赞业务
   *
   * @static
   * @param {*} art_id 点赞的实体表数据的id
   * @param {*} type 点赞类型 是音乐，还是书籍等
   * @param {*} uid 用户标识id
   * @memberof Favor
   */
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id, type, uid
      }
    });
    if (favor) {
      // 当前用户对这个classic已经点赞过了
      throw new LikeError("已经点赞过了！");
    }
    // 添加记录 然后修改fav_nums 设计到两张表的同时修改数据
    // TODO! 需要使用事务 保证数据的一致性 原子性
    // 这个方式是sequence的托管事务 没有异常自动提交事务
    // 有异常 自动回滚
    const res = await db.transaction(async (t) => {
      // 添加记录
      await Favor.create({
        art_id, type, uid
      }, {
        transaction: t
      });
      const art = await Art.getData(art_id, type);
      // 给这个模型的那个字段进行+1 有by指定具体增大的数量
      await art.increment("fav_nums", { by: 1, transaction: t });
    });
  }
  /**
   * 获取用户对classic的点赞信息
   *
   * @static
   * @param {*} art_id
   * @param {*} type
   * @param {*} uid
   * @memberof Favor
   */
  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id, type, uid
      }
    });
    if (!favor) {
      // 当前用户对这个classic已经点赞过了
      throw new DislikeError();
    }
    const res = await db.transaction(async (t) => {
      // 删除记录 使用查出来的记录进行销毁操作，直接销毁自身
      // 毕竟已经定位到表中的数据了
      await favor.destroy({
        // 软删除 标记删除
        force: false,
        // TODO 事务参数也在这个里面
        transaction: t
      });
      const art = await Art.getData(art_id, type);
      // 减1
      await art.decrement("fav_nums", { by: 1, transaction: t });
    });
  }
  /**
   * 获取当前用户点赞状态
   *
   * @static
   * @param {*} art_id 具体的记录id
   * @param {*} type classic类型
   * @param {*} uid 用户
   * @return {*} 
   * @memberof Favor
   */
  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id, type, uid
      }
    });
    // 返回是否点赞即可 其实取反就会把一个对象转为布尔类型
    return !!favor;
  }
  /**
   * 获取用户喜欢的期刊，但是不包括书籍
   *
   * @static
   * @param {*} uid
   * @memberof Favor
   */
  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          // 排除类型为400 的书籍
          [Op.not]: 400
        }
      }
    });
    if (!arts) throw new NotFound();
    // 根据type和fav_id 去实体表中查询具体的信息
    return await Art.getArtList(arts);
  }
}
Favor.init({
  // 用户标识
  uid: DataTypes.INTEGER,
  // 具体的数据的id标识
  art_id: DataTypes.INTEGER,
  // 期刊类型
  type: DataTypes.INTEGER
}, {
  sequelize: db,
  tableName: "favor"
});

module.exports = Favor;
