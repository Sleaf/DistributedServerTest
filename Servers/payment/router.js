const Router = require('koa-router');
const router = new Router();

const Controller_user = require('./controller/user');
const Controller_order = require('./controller/orders');

router
  .post('/login', Controller_user.login)
  .post('/register', Controller_user.register)
  .all('*', async (ctx, next) => {
    if (ctx.session.views == null) ctx.throw(403);
    else await next();
  })
  .get('/order', Controller_order.getOrders)
  .post('/order', Controller_order.takeOrders)
  .all('*', (ctx) => {
    ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
  });

module.exports = router;