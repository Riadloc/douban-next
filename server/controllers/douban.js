const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const dayjs = require('dayjs');
const fs = require("fs");
const { GROUP_RENTING } = require('../static/config');
const { spider } = require('../services/spider')
const { findDataByParams, findDataById, count } = require('../utils/db-util');
const dataFormat = 'YYYY-MM-DD';

module.exports = {
  async doSpider(ctx) {
    const formdata = ctx.request.body;
    await spider(formdata);
    ctx.body = { data: '执行完成！' };
  },

  async getHouseList(ctx) {
    const formdata = ctx.request.body;
    const houseList = await findDataByParams(formdata);
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