const path = require("path");
const router = require('koa-router')();


require('./api')(router)

require('./web')(router)



//做一个中间过滤层 (默认自带项目自身名称)
function obj(projectName, router){
  this.projectName = projectName
  this.get = (url, fn)=>{
    router.get("/"+this.projectName+url, fn)
  }
  this.post = (url, fn)=>{
    router.post("/"+this.projectName+url, fn)
  }
}

//注入子项目路由
const fs = require('fs');
const projectUrl = path.join(__dirname, '../../../project');
const files = fs.readdirSync(projectUrl)
files.forEach((file)=>{
  var newRouter = new obj(file, router)
  require('../../../project/'+file)(newRouter)
})

module.exports = router;