const { Op } = require("sequelize");
const { flatten } = require("lodash");
const Favor = require("./favor");
const { host } = require("../config")

const { Movie, Music, Sentence } = require("./classis");
/*
 * @Author: 毛毛 
 * @Date: 2021-09-12 19:35:44 
 * @Last Modified by: 毛毛
 * @Last Modified time: 2021-09-15 17:42:05
 */
class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
  }
  /**
   *
   * 获取文章详情，classic详情页数据
   * @param {number} uid 用户id
   * @return {*} 
   * @memberof Art
   */
  async getDetail(uid) {
    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new NotFound();
    }
    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    // art.setDataValue("like_status",like);
    return {
      art,
      like_status: like
    };
  }
  /**
   * 查询实体表中的数据
   *
   * @static
   * @param {*} art_id 字段的唯一id
   * @param {*} type 类型（那个实体的）
   * @memberof Art
   */
  static async getData(art_id, type) {
    // 查询条件
    const where = { id: art_id };
    // 查询结果
    let art;
    switch (type) {
      case 100:
        art = await Movie.findOne({
          where
        });
        break;
      case 200:
        art = await Music.findOne({
          where
        });
        break;
      case 300:
        art = await Sentence.findOne({
          where
        });
        break;
      case 400:
        const Book = require("./book");
        art = await Book.findOne({
          where
        });
        // 没找到书籍
        if (!art) {
          art = await Book.create({
            id: art_id,
            fav_nums: 0
          })
        }
        break;
    }
    return art;
  }

  static async getArtList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    };
    for (const artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (const key in artInfoObj) {
      if (!artInfoObj[key].length) continue;
      arts.push(await Art._getListByType(artInfoObj[key], Number.parseInt(key)));
    }
    // 返回前进行数组的扁平化
    return flatten(arts);
    // return arts;
  }
  static async _getListByType(ids, type) {
    let arts;
    const where = {
      id: {
        [Op.in]: ids
      }
    };
    switch (type) {
      case 100:
        arts = await Movie.findAll({
          where
        });
        break;
      case 200:
        arts = await Music.findAll({
          where
        });
        break;
      case 300:
        arts = await Sentence.findAll({
          where
        });
        break;
    }
    return arts;
  }
}

module.exports = Art;