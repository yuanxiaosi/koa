module.exports = (router)=>{

  router.get('/index', require('../controller/web/index').index);

  router.get('/login', require('../controller/web/login').index);

};