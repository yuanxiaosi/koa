const router = require('koa-router')();



require('./api')(router)

require('./web')(router)


module.exports = router;