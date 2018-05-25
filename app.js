const Koa = require('koa');
const routers = require('./server/routers');
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const port = 3000;
  const server = new Koa();

  server.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });

  // 配置ctx.body解析中间件
  server.use(bodyParser())

  // 配置服务端模板渲染引擎中间件
  server.use(views(path.join(__dirname, './server/views'), {
    extension: 'njk',
    map: {
      njk: 'nunjucks'
    }
  }))

  server.use(async (ctx, next) => {
    // Koa doesn't seems to set the default statusCode.
    // So, this middleware does that
    ctx.res.statusCode = 200;
    await next();
  })

  routers.get('*', async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  // 初始化路由中间件
  server.use(routers.routes()).use(routers.allowedMethods())

  console.log(`open http://localhost:${port} in browser`);
  server.listen(port);
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})