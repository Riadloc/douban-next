const nodejieba = require('nodejieba');
const { spider } = require('../services/spider')
const { findDataByParams, findDataById, count } = require('../utils/db-util');

module.exports = {
  doSpider(ctx) {
    const formdata = ctx.request.body;
    spider(formdata);
    ctx.body = { data: '已接受爬虫请求！' };
  },

  async getHouseList(ctx) {
    let formdata = ctx.request.body;
    let reg = '^.*$';
    const { keyword } = formdata;
    if (keyword && keyword.trim()) {
      const result = nodejieba.extract(keyword, 5).map(item => `(?=.*${item.word})`).join('');
      reg = result + reg;
      console.log(result);
    }
    formdata = Object.assign(formdata, { keyword: reg });
    const houseList = await findDataByParams(formdata);
    const amount = await count(formdata);
    ctx.body = { houseList, amount: amount[0]['total_count'] };
  },

  async getListAmount(ctx) {
    const amount = await count();
    ctx.body = { amount };
  },

  async getHouseById(ctx) {
    const formdata = ctx.request.body;
    const { id } = formdata;
    const result = await findDataById({id});
    ctx.body = { houseInfo: result[0] };
  }
}