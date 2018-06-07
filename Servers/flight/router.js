const Router = require('koa-router');
const router = new Router().prefix('/api');

const Controller_user = require('./controller/user');
const Controller_info = require('./controller/info');

router.post('/login', Controller_user.login);
router.post('/register', Controller_user.register);
router.get('/getInfo', Controller_info.getFlightsInfo);
router.get('/addInfo', Controller_info.addInfo);


router.get('*', (ctx)=>{
  ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
});

module.exports = router;