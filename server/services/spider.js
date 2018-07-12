const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const _ = require('lodash/lang')
const iPhone = devices['iPhone 6'];
const dayjs = require('dayjs');
const fs = require("fs");
const { GROUP_RENTING } = require('../static/config');
const { insertData } = require('../utils/db-util');
const dataFormat = 'YYYY-MM-DD';

module.exports = {
  async spider(formdata) {
    const today = dayjs().format(dataFormat);
    let { createTimeBegin = today,
      createTimeEnd = today,
      updateTimeBegin = today,
      updateTimeEnd = today,
      kwType = 'notin',
      keyword = '',
      frequency = 20
    } = formdata;
    if (typeof frequency === 'string') frequency = Number(frequency);
    
    const currentHour = dayjs().hour();
    const delay = (currentHour < 21 && currentHour > 4) ? 1500 : 800;
    console.log(delay);
    const browser = await puppeteer.launch({
      executablePath: '/usr/lib64/chromium-browser/chromium-browser',
      args: ['--no-sandbox']
    });
    let start = 0;
    const offset = 25;
    const timeReg = /^\d{4}-\d{2}-\d{2}$/;
    const currentYear = dayjs().year();
    let flag = true;
    let list = [];
    const page = await browser.newPage();
    const page_detail = await browser.newPage();
    while (flag) {
      if (start/25 > 4) break;
      console.log(`..........开始爬取${start/25 + 1}页.........`)
      await page.goto(GROUP_RENTING + 'start='+ start).then(async () => {
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
        for (const value of html) {
          let { update_time, link } = value;
          const rentReg = /(\D|^)(\d{4})(\D|$)/;
          const [unitReg, oneReg, TwoReg, ThreeReg, fourReg] =
            [/一室|二室|三室|四室|单间|两室|双人间|三人间|四人间|主卧|次卧/, /一室|单间|主卧|次卧/, /二室|双人间|两室/, /三室|三人间/, /四室|四人间/];
          update_time = update_time.split(' ')[0];
          if (!timeReg.test(update_time)) update_time = `${currentYear}-${update_time}`;
          if (dayjs(updateTimeBegin).isAfter(dayjs(update_time))) {
            flag = false;
            break;
          }
          await page_detail.goto(link, { timeout: 10000 }).then(async () => {
            await page_detail.waitForSelector('.topic-content', { timeout: 2000 }).then(async () => {
              const detail = await page_detail.$eval('.topic-content', content => {
                const avatar = $(content).find('.user-face img').attr('src').split('/').slice(-1)[0];
                const create_time = $(content).find('.topic-doc .color-green').text();
                const description = $(content).find('#link-report .topic-richtext p').text() || '';
                const detail_imgs = [];
                $(content).find('#link-report .topic-richtext img').each((idx, x) => {
                  detail_imgs.push($(x).attr('src').split('/').slice(-1)[0]);
                })
                return { avatar, description, create_time, detail_imgs: JSON.stringify(detail_imgs) }
              })
              const [title, description] = [value.title, detail.description];
              let [rent, unit, temp] = [0, '', null];
              if (title.match(rentReg)) {
                temp = title.match(rentReg);
                if (_.isArray(temp)) temp = temp[0];
                rent = Number.parseInt(temp.replace(rentReg, '$2'));
              } else if (description.match(rentReg)) {
                temp = description.match(rentReg);
                if (_.isArray(temp)) temp = temp[0];
                rent = Number.parseInt(temp.replace(rentReg, '$2'));
              }
              if (title.match(unitReg) || description.match(unitReg)) {
                temp = title.match(unitReg) || description.match(unitReg);
                if (_.isArray(temp)) temp = temp[0];
                if (oneReg.test(temp)) unit = '一室';
                else if (TwoReg.test(temp)) unit = '二室';
                else if (ThreeReg.test(temp)) unit = '三室';
                else if (fourReg.test(temp)) unit = '四室';
              }
              list.push(Object.assign(detail, value, { rent, unit }));
              await page_detail.waitFor(delay);
            }).catch(async (err) => {
              console.log(value.id + ' failed');
              console.log(err);
              await page_detail.waitFor(delay);
            })
          }).catch(async (err) => {
            console.log(err);
            await page_detail.waitFor(delay);
          })
        }
        console.log(`..........爬取${start/25 + 1}页完成.........`)
        start = start + offset;
        await page.waitFor(delay);
      }).catch(async (err) => {
        console.log((start/25+1) + '页 failed: ' + err);
        start = start + offset;
        await page.waitFor(delay);
      })
    }
    await browser.close();
    const user_list_arr = list.map(item => item.user);
    const user_list_str = ',' + user_list_arr.join(',') + ',';
    list.forEach((item) => {
      let { create_time, update_time, title, user, description } = item;
      create_time = dayjs(create_time.split(' ')[0]);
      update_time = update_time.split(' ')[0];
      if (!timeReg.test(update_time)) update_time = `${currentYear}-${update_time}`;
      update_time = dayjs(update_time);
      const flag_1 = !(dayjs(createTimeBegin).isAfter(create_time) || dayjs(createTimeEnd).isBefore(dayjs(create_time)))
      const flag_2 = !dayjs(updateTimeEnd).isBefore(dayjs(update_time));
      let flag_3 = true;
      if (keyword.trim()) {
        flag = title.includes(keyword) || description.includes(keyword);
        if (kwType === 'notin') flag_3 = !flag_3;
      }
      let freqs = user_list_str.match(new RegExp(','+user+',', 'g'));
      freqs = freqs ? freqs.length : 0;
      const flag_4 = freqs < frequency;
      if (flag_1 && flag_2 && flag_3 && flag_4) {
        insertData(item);
      };
    })
    console.log('..........爬取完成.........')
  }
}
