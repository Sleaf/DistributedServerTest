const Router = require('koa-router');
const router = new Router().prefix('/api');

const Controller_user = require('./controller/user');
const Controller_getInfo = require('./controller/getInfo');

router.post('/login', Controller_user.login);
router.post('/register', Controller_user.register);
router.get('/getInfo', Controller_getInfo.getFlightsInfo);


router.get('*', (ctx)=>{
  ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
});

module.exports = router;