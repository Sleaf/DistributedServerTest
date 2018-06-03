const Router = require('koa-router');
const router = new Router().prefix('/api');

const Controller_user = require('./controller/user');
const Controller_scan = require('./controller/scan');
const Controller_order = require('./controller/order');

router.post('/login', Controller_user.login);
router.post('/register', Controller_user.register);
router.get('/scan', Controller_scan.getTicketsByDate);
router.post('/order', Controller_order.launch);


router.get('*', (ctx)=>{
  ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
});

module.exports = router;