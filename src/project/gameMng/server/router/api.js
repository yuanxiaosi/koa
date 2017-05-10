module.exports = (router)=>{

  router.get('/api', require('../controller/api').index);

  router.get('/api/data', require('../controller/api/data').index);

};