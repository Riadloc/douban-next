const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const dayjs = require('dayjs');
const fs = require("fs");
const { GROUP_RENTING } = require('../static/config');
const { insertData, findDataByPage, findDataById, count } = require('../utils/db-util');
const dataFormat = 'YYYY-MM-DD';

module.exports = {
  async spider(ctx) {
    const today = dayjs().format(dataFormat);
    const formdata = ctx.request.body;
    let { createTimeBegin = today,
      createTimeEnd = today,
      updateTimeBegin = today,
      updateTimeEnd = today,
      kwType = 'notin',
      keyword = '',
      frequency = 20
    } = formdata;
    if (typeof frequency === 'string') frequency = Number(frequency);

    const browser = await puppeteer.launch();
    let start = 0;
    const offset = 25;
    const timeReg = /^\d{4}-\d{2}-\d{2}$/;
    const currentYear = dayjs().year();
    let flag = true;
    let list = [];
    const page = await browser.newPage();
    const page_detail = await browser.newPage();
    while (flag) {
      await page.goto(GROUP_RENTING + 'start='+ start);
      await page.waitForSelector('.olt');
      const html = await page.$$eval('.olt tr', list => {
        return list.slice(1).map(item => {
          const aTag = $(item).find('.title a');
          const [ user, reply, update_time ] = item.innerText.split('\t').slice(1);
          const link = aTag.attr('href');
          const temp = link.split('/');
          const id = temp[temp.indexOf('topic')+1]
          return { id, title: aTag.attr('title'), user, reply, update_time, link };
        })
      });
      for (const index of html.keys()) {
        const value = html[index];
        let { update_time, link } = value;
        update_time = update_time.split(' ')[0];
        if (!timeReg.test(update_time)) update_time = `${currentYear}-${update_time}`;
        if (dayjs(updateTimeBegin).isAfter(dayjs(update_time))) {
          flag = false;
          break;
        }
        await page_detail.goto(link);
        delete value['link'];
        await page_detail.waitForSelector('.topic-content');
        const detail = await page_detail.$eval('.topic-content', content => {
          const avatar = $(content).find('.user-face img').attr('src').split('/').slice(-1)[0];
          const created_time = $(content).find('.topic-doc .color-green').text();
          const description = $(content).find('#link-report .topic-richtext p').text() || '';
          const detail_imgs = [];
          $(content).find('#link-report .topic-richtext img').each((idx, x) => {
            detail_imgs.push($(x).attr('src').split('/').slice(-1)[0]);
          })
          return { avatar, description, created_time, detail_imgs: JSON.stringify(detail_imgs) }
        })
        html[index] = Object.assign(value, detail);
        list.push(html[index]);
        await page_detail.waitFor(100);
        // await insertData(html[index]);
      }
      start = start + offset;
      await page.waitFor(100);
    }
    await browser.close();
    const user_list_arr = list.map(item => item.user);
    const user_list_str = ',' + user_list_arr.join(',') + ',';
    const user_list_set = [...new Set(user_list_arr)];
    list.filter(item => {
      let { created_time, update_time, title, user, description } = item;
      created_time = dayjs(created_time.split(' ')[0]);
      update_time = update_time.split(' ')[0];
      if (!timeReg.test(update_time)) update_time = `${currentYear}-${update_time}`;
      update_time = dayjs(update_time);
      const flag_1 = !(dayjs(updateTimeBegin).isAfter(created_time) || dayjs(updateTimeEnd).isBefore(dayjs(created_time)))
      const flag_2 = !dayjs(updateTimeEnd).isBefore(dayjs(update_time));
      let flag_3 = true;
      if (keyword.trim()) {
        flag = title.includes(keyword) || description.includes(keyword);
        if (kwType === 'notin') flag_3 = !flag_3;
      }
      let freqs = user_list_str.match(new RegExp(','+user+',', 'g'));
      freqs = freqs ? freqs : 0;
      const flag_4 = freqs < frequency;
      return flag_1 && flag_2 && flag_3 && flag_4;
    })
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