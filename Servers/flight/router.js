const Router = require('koa-router');
const router = new Router().prefix('/api');

const Controller_user = require('./controller/user');
const Controller_info = require('./controller/info');

router
  .post('/login', Controller_user.login)
  .post('/register', Controller_user.register)
  .get('/getInfo', Controller_info.getFlightsInfo)
  .all('*', async (ctx, next) => {
    if (ctx.session.views == null) ctx.throw(403);
    else await next();
  })
  .get('/addInfo', Controller_info.addInfo)
  .all('*', (ctx) => {
    ctx.body = `您的网址路径为:${ctx.request.url}，你的ip：${ctx.request.ip}`
  });

module.exports = router;