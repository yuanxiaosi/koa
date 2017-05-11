'use strict'

const Koa = require('koa');
const app = new Koa();
const path = require('path');
const router = require('./server/router');

// x-response-time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);

});

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response
app.use(async (ctx, next) => {
  //ctx.body = 'hello world!'
  await next()
});


//设置静态资源路径
const staticServer = require('koa-static');
app.use(staticServer(path.join(__dirname, './build/static')));

//设置模板引擎
/*const views = require('koa-views')
app.use(views(path.join(__dirname, './template'), {
  extension: 'ejs'
}))*/

app
  .use(router.routes())
  .use(router.allowedMethods());



require('./mount')(app)



app.listen(3000);