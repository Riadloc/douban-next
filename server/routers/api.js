const router = require('koa-router')()
const doubanController = require('../controllers/douban');

module.exports = router
  .post('/getHouseList', doubanController.getHouseList)
  .post('/getListAmount', doubanController.getListAmount)
  .post('/spider', doubanController.spider);