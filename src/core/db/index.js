const { Sequelize, Model } = require("sequelize");
const { unset, clone, isArray } = require("lodash");
// 导入配置
const { database } = require("../../config")
const { host } = require("../../config")

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

// 在Model模型类上的原型上，定义一个toJSON方法，直接改变所有模型类
// 在序列化的时候，都可以排除时间字段
Model.prototype.toJSON = function () {
  // let data = this.dataValues;
  // 进行浅拷贝 不修改原数据
  let data = clone(this.dataValues);
  // 删除所有对象上的时间字段
  unset(data, "updated_at");
  unset(data, "created_at");
  unset(data, "deleted_at");
  for (const key in data) {
    if (key === "image") {
      if (!data[key].startsWith("http"))
        data[key] = host + data[key];
    }
  }
  // 再次排除子组件上挂载的exclude数组里面的字段
  if (isArray(this.exclude)) {
    this.exclude.forEach(item => {
      unset(data, item);
    })
  }
  return data;
}

module.exports = sequence;