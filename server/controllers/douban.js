const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const dayjs = require('dayjs');
const fs = require("fs");
const { GROUP_RENTING } = require('../static/config');
const spider = require('../services/spider')
const { insertData, findDataByPage, findDataById, count } = require('../utils/db-util');
const dataFormat = 'YYYY-MM-DD';

module.exports = {
  async doSpider(ctx) {
    const today = dayjs().format(dataFormat);
    const formdata = ctx.request.body;
    const list = await spider(formdata);
    ctx.body = { msg: 'success', list };
  },

  async getHouseList(ctx) {
    const formdata = ctx.request.body;
    const { page } = formdata;
    const houseList = await findDataByPage({page});
    const amount = await count();
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