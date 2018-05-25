const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const dayjs = require('dayjs');
const fs = require("fs");
const { GROUP_RENTING } = require('../static/config');
const { insertData, findDataByPage } = require('../utils/db-util');

module.exports = {
  async spider(ctx) {
    const browser = await puppeteer.launch();
  
    let start = 0;
    const offset = 25;
    const timeReg = /^\d{4}-\d{2}-\d{2}$/;
    const currentYear = dayjs().year();
    const end = dayjs(currentYear + '-05-22');
    let flag = true;
    let page = await browser.newPage();
    let list = [];
    while (flag) {
      await page.goto(GROUP_RENTING + 'start='+ start);
      const html = await page.$$eval('.olt tr', list => {
        return list.slice(1).map(item => {
          const [ user, reply, lasted_time ] = item.innerText.split('\t').slice(1);
          return { title: $(item).find('.title a').attr('title'), user, reply, lasted_time };
        })
      });
      for (const value of html) {
        await insertData(value);
        let { lasted_time } = value;
        lasted_time = lasted_time.split(' ')[0];
        if (!timeReg.test(lasted_time)) lasted_time = `${currentYear}-${lasted_time}`;
        if (end.isAfter(dayjs(lasted_time))) {
          flag = false;
          break;
        }
      }
      list = list.concat(html);
      start = start + offset;
      page.waitFor(800);
    }
    await browser.close();
    ctx.body = { data: 'success' };
  },

  async getHouseList(ctx) {
    const formdata = ctx.request.body;
    const { page } = formdata;
    const houseList = await findDataByPage({page});
    ctx.body = { houseList };
  }
}