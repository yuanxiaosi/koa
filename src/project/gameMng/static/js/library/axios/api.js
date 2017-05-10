import axios from 'axios';
import np from 'nprogress';

let api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30 * 1000,
  transformRequest: [(data) => {
  	np.start();
    if (!data) {
      return '';
    }
    return JSON.stringify(data);
  }],
  transformResponse: [(data) => {
  	np.done();
    return JSON.parse(data);
  }]
});

api.interceptors.request.use( (config) => {
    let now = new Date().getTime();
    let params = config.url.split('?')[1]; 
    if(!params){
      config.url = config.url + "?_=" + now;
    }else{
      config.url = config.url + "&_=" + now;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use( (response) => {
    np.done()
    if (!response.data) {
      return Promise.reject('服务器返回数据异常!');
    }
    return response.data;
  }, (error) => {
    alert('系统开小差了,请重试!');
    return Promise.reject(error);
  }
);

export default api;
