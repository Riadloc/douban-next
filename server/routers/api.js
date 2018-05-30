const router = require('koa-router')()
const doubanController = require('../controllers/douban');

module.exports = router
  .post('/getHouseList', doubanController.getHouseList)
  .post('/getListAmount', doubanController.getListAmount)
  .post('/getHouseById', doubanController.getHouseById)
  .post('/spider', doubanController.spider);