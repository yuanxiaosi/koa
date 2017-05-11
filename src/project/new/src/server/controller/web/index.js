let obj = {}

obj.index = async (ctx, next)=>{
  let title = 'hello koa2'

  await ctx.render('index', {
    title,
  })
}

module.exports = obj