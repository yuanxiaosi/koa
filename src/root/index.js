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


/*var staticServer = require('koa-static');
var path = require('path');
console.log(path.join(__dirname,'./static'))
app.use(staticServer(path.join(__dirname,'./static')));*/


app
  .use(router.routes())
  .use(router.allowedMethods());




const views = require('koa-views')
var path = require('path');
// 加载模板引擎
app.use(views(path.join(__dirname, './template'), {
  extension: 'ejs'
}))

app.use( async ( ctx ) => {
  let title = 'hello koa2'
  await ctx.render('aaa/index', {
    title,
  })
})




app.listen(3000);