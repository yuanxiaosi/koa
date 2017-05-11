import api from '../library/axios/api';

// 根据你的接口封装以下服务
let IndexService = {
  
  //财务汇总
  financeIncomeSummary: (data) => {
    return api.get(`/api/finance/incomeSummary?isExport=${data.isExport}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&startDate=${data.startDate}&endDate=${data.endDate}`) 
  },
  financeIncomeDetail: (data) => {
    return api.get(`/api/finance/incomeDetail?isExport=${data.isExport}&businessId=${data.businessId}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&startDate=${data.startDate}&endDate=${data.endDate}`) 
  },


  //数据统计------收入汇总
  dataIncomeDetail: (data) => {
    return api.get(`/api/data/incomeTotal?isExport=${data.isExport}&businessId=${data.businessId}&startDate=${data.startDate}&endDate=${data.endDate}&dateType=${data.dateType}`) 
  },
  dataGetExStall: (data) => {
    return api.get(`/api/data/getExStall?isExport=${data.isExport}&businessId=${data.businessId}&startDate=${data.startDate}&endDate=${data.endDate}&dateType=${data.dateType}&dayreportExType=${data.dayreportExType}`) 
  },
  getSurplusCoin: () => { //获取当前剩余游戏币
    return api.get(`/api/data/getSurplusCoin`) 
  },
  getPointPlayRecordDetail: (data) => { //获取当前游戏信息（时长，平均积分等）
    return api.get(`/api/data/getPointPlayRecordDetail?startDate=${data.startDate}&endDate=${data.endDate}`) 
  },
  getPointEcharts: (data) => { //获取当前游戏信息（时长，平均积分等）
    return api.get(`/api/data/getPointEcharts?startDate=${data.startDate}&endDate=${data.endDate}&dateType=${data.dateType}&businessId=${data.businessId}`) 
  },
  getUserLog: (data) => { //获取当前游戏信息（时长，平均积分等）
    return api.get(`/api/data/getUserLog?isExport=${data.isExport}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&startDate=${data.startDate}&endDate=${data.endDate}&dateType=${data.dateType}`) 
  },


  //business
  getProcessStatus: (data) => {
    return api.get(`/api/processStatus?all=${data.all}`);
  },
  getBusinessList: (data) => {
    return api.get(`/api/business/list?isExport=${data.isExport}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&businessId=${data.businessId}&processStatus=${data.processStatus}`) 
  },
  getBusinessDetail: (data) => {
    return api.get(`/api/business/detail?businessId=${data.businessId}`) 
  },
  businessAdd: (data) => {
    return api.post(`/api/business/add`, data) 
  },
  businessUpdate: (data) => {
    return api.post(`/api/business/update`, data) 
  },
  getProcessByBusinessId: (data) => {
    return api.get(`/api/business/getProcessById?id=${data.id}`) 
  },
  updateProcessByBusinessId: (data) => {
    return api.post(`/api/business/updateProcessById`, data) 
  },

  //user
  userfuzzyGet: (data) => {
    return api.get(`/api/user/fuzzyGet?nickName=${data.nickName}`) 
  },



  //公共接口
  getRegion: (data) => {
    return api.get('/api/region?status='+data.status);
  },
  getBusiness: (regionId) => {
    return api.get(`/api/business?regionId=${regionId}`);
  },


  //商品接口
  goodsAdd: (data) => {
    return api.post(`/api/goods/add`, data)
  },
  goodsAddSerial: (data) => {
    return api.post(`/api/goods/addSerial`, data)
  },
  updateGoods: (data) => {
    return api.post(`/api/goods/update`, data)
  },
  getGoods: () => {
    return api.get(`/api/goods/getGoods`)
  },
  getSerial: (goodsId) => {
    return api.get(`/api/goods/getSerial?goodsId=${goodsId}`)
  },
  getGoodsByGoodsId: (goodsId) => {
    return api.get(`/api/goods/getGoodsByGoodsId?goodsId=${goodsId}`)
  },
  getGoodsExSerial: (data) => {
    return api.get(`/api/goods/getGoodsExSerial?isExport=${data.isExport}&businessId=${data.businessId}&goodsId=${data.goodsId}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&startDate=${data.startDate}&endDate=${data.endDate}`)
  },
  getGoodsDetail: (goodsId) => {
    return api.get(`/api/goods/getGoodsDetail?goodsId=${goodsId}`)
  },




  //导出excel
  getExcel: (data) => {
    return api.post('/api/exportExcel', data);
  },

  //登录
  login: (data) => {
    return api.get(`/api/admin/login?userName=${data.userName}&passWord=${data.passWord}&msgCode=${data.msgCode?data.msgCode:""}`);
  },
  //登出
  logout: () => {
    return api.get('/api/admin/logout');
  }
};

module.exports = IndexService;
