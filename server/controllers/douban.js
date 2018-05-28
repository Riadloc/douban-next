const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const dayjs = require('dayjs');
const fs = require("fs");
const { GROUP_RENTING } = require('../static/config');
const { insertData, findDataByPage, count } = require('../utils/db-util');

module.exports = {
  async spider(ctx) {
    const browser = await puppeteer.launch();
  
    let start = 0;
    const offset = 25;
    const timeReg = /^\d{4}-\d{2}-\d{2}$/;
    const currentYear = dayjs().year();
    const end = dayjs(currentYear + '-05-28');
    let flag = true;
    const page = await browser.newPage();
    const page_detail = await browser.newPage();
    while (flag) {
      await page.goto(GROUP_RENTING + 'start='+ start);
      await page.waitForSelector('.olt');
      const html = await page.$$eval('.olt tr', list => {
        return list.slice(1).map(item => {
          const aTag = $(item).find('.title a');
          const [ user, reply, update_time ] = item.innerText.split('\t').slice(1);
          return { title: aTag.attr('title'), user, reply, update_time, link: aTag.attr('href') };
        })
      });
      for (const index of html.keys()) {
        const value = html[index];
        let { update_time, link } = value;
        update_time = update_time.split(' ')[0];
        if (!timeReg.test(update_time)) update_time = `${currentYear}-${update_time}`;
        if (end.isAfter(dayjs(update_time))) {
          flag = false;
          break;
        }
        await page_detail.goto(link);
        delete value['link'];
        await page_detail.waitForSelector('.topic-content');
        const detail = await page_detail.$eval('.topic-content', content => {
          const avatar = $(content).find('.user-face img').attr('src').split('/').slice(-1)[0];
          const created_time = $(content).find('.topic-doc .color-green').text();
          const detail_imgs = [];
          $(content).find('#link-report .topic-richtext img').each((idx, x) => {
            detail_imgs.push($(x).attr('src').split('/').slice(-1)[0]);
          })
          return { avatar, created_time, detail_imgs: JSON.stringify(detail_imgs) }
        })
        html[index] = Object.assign(value, detail);
        await page_detail.waitFor(300);
        await insertData(html[index]);
      }
      start = start + offset;
      await page.waitFor(300);
    }
    await browser.close();
    ctx.body = { msg: 'success' };
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
  }
}