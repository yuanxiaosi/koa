const path = require("path");
const mount = require('koa-mount');
const fs = require('fs');
const projectUrl = path.join(__dirname, '../project');
const files = fs.readdirSync(projectUrl)


module.exports = (app)=>{
  //项目注入
  files.forEach((file)=>{
    app.use(mount('/act/'+file, require('../project/'+file)))
  })
}