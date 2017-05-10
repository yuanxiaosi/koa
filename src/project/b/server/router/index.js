
module.exports = (router)=>{

  require('./api')(router)

  require('./web')(router)
  
};