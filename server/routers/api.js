const router = require('koa-router')()
const doubanController = require('../controllers/douban');

module.exports = router
  .post('/douban', doubanController.getHouseList);