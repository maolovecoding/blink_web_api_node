const { Model, DataTypes } = require("sequelize");
const db = require("../core/db");

/**
 * 期刊模型，属于业务表，也是业务模型
 *
 * @class Flow
 * @extends {Model}
 */
class Flow extends Model { }
// 使用 type确定表，art_id确定表中具体的记录
Flow.init({
  // 期刊的期号 （第一期，第二期...）
  index: DataTypes.INTEGER,
  // 实体表的编号id 也就是他们的组件
  art_id: DataTypes.INTEGER,
  // 期刊类型 是那个实体表的，只有type确定，才能确定art_id
  // 这个就是期刊所属实体表的类型
  // type:100-->Movie  200--> Music  300 --> Sentence
  type: DataTypes.INTEGER,
  status:DataTypes.SMALLINT(6)
}, {
  sequelize: db,
  tableName: "flow"
});

module.exports = Flow;