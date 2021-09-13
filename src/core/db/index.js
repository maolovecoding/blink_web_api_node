const { Sequelize } = require("sequelize");

// 导入配置
const { database } = require("../../config")

// 数据库类型
database.dialect = "mysql";
// 控制台 显示查询参数
database.logQueryParameters = true;
// 设置时区
database.timezone = "+08:00";
// 个性化配置
database.define = {
  // 不添加创建时间字段，更新时间字段
  timestamps: true,
  // 删除模型字段
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  // 把驼峰命名转换为下划线
  underscored: true,
  freezeTableName: true,
  scopes: {
    bh: {
      attributes: {
        exclude: ['updated_at', 'deleted_at', 'created_at']
      }
    }
  }
};
const sequence = new Sequelize(database);

// sequence.sync({
//   // force 表不存在 直接创建 表存在 删除后创建
//   //force: true
// }).then((res) => {
//   console.log("所有模型均已成功同步.");
// });



module.exports = sequence;