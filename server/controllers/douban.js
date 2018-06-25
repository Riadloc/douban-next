const Segment  = require('segment');
const { spider } = require('../services/spider');
const { findDataByParams, findDataById, count } = require('../utils/db-util');

const segment = new Segment();
segment.use({
  type: 'optimizer',
  init: function (segment) {},
  doOptimize: function (words) {
    return words.filter(item => !/的|得|地/.test(item.w));
  }
});
segment.useDefault();

module.exports = {
  doSpider(ctx) {
    const formdata = ctx.request.body;
    spider(formdata);
    ctx.body = { data: '已接受爬虫请求！' };
  },

  async getHouseList(ctx) {
    let formdata = ctx.request.body;
    let reg = '^.*$';
    let { keyword, unit } = formdata;
    if (keyword && keyword.trim()) {
      const result = segment.doSegment(keyword, {
        stripPunctuation: true,
        stripStopword: true,
        simple: true
      }).map(item => `(?=.*${item})`).join('');
      console.log(result);
      reg = result + reg;
    }
    if (!unit) {
      unit = '^.*$';
    }
    formdata = Object.assign(formdata, { keyword: reg, unit });
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