const Koa = require('koa');
const session = require('koa-session');
const cors = require('koa2-cors');
const RedisStore = require('koa2-session-redis');
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const accounts = require('../../accounts');
const app = new Koa();
const $ = require('./util');

const sessionConfig = {
  key      : 'sessionID', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge   : 30 * 60 * 1000,//30min
  overwrite: true,//(boolean) can overwrite or not (default true) */
  httpOnly : true,//(boolean) httpOnly or not (default true) */
  signed   : true,//(boolean) signed or not (default true) */
  rolling  : false,//(boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew    : false,//(boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  store    : new RedisStore({
    port: accounts.redis.port,          // Redis port
    host: accounts.redis.host,   // Redis host
  }),
};

app.keys = ['NTM'];
app
  .use(session(sessionConfig, app))
  .use(bodyParser())
  .use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge       : 5,
    credentials  : true,
    allowMethods : ['GET', 'POST', 'DELETE'],
    allowHeaders : ['Content-Type', 'Authorization', 'Accept'],
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', err => {
  console.error('server error: ' + err.message || err)
});
const port = 3000;
app.listen(port);
console.log('日常服务器已启动，port：' + port);
