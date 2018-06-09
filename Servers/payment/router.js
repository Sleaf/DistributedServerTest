const Router = require('koa-router');
const router = new Router().prefix('/api');

const Controller_user = require('./controller/user');
const Controller_order = require('./controller/orders');

router.post('/login', Controller_user.login);
router.post('/register', Controller_user.register);
router.get('/order', Controller_order.getOrders);
router.post('/order', Controller_order.takeOrders);


router.get('*', (ctx) => {
  ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
});

module.exports = router;