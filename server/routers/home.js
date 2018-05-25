const router = require('koa-router')()
const homeController = require('../controllers/home');

module.exports = router.get('/', homeController);