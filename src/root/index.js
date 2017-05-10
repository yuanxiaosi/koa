const Koa = require('koa');
const app = new Koa();
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



app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000);