const Router = require('koa-router');
const router = new Router().prefix('/api');

const Controller_user = require('./controller/user');
const Controller_scan = require('./controller/scan');
const Controller_order = require('./controller/order');

router
  .post('/login', Controller_user.login)
  .post('/register', Controller_user.register)
  .get('/scan', Controller_scan.getFlightsFsByDate)
  .all('*', async (ctx, next) => {
    if (ctx.session.views == null) ctx.throw(403);
    else {
      await next();
    }
  })
  .get('/order', Controller_order.checkOrders)
  .post('/order', Controller_order.takeOrders)
  .all('*', (ctx) => {
    ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
  });

module.exports = router;