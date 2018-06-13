//时间格式化
Date.prototype.format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, //月份
    'D+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
};
const util = {

};

//创建axios
util.ajax = axios.create({
  /*开发环境如果要使用在线接口 请使用8999端口
  * 生产环境请将API请求发到静态文件部署端口会使用nginx进行URL重写*/
  // baseURL: `http://localhost`,
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: true,
  timeout: 30 * 1000,
});

//添加并发管理
util.ajax.all = axios.all;

// 添加请求拦截器
util.ajax.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
util.ajax.interceptors.response.use((response) => {
    if (response.data.code !== 200) {
      return Promise.reject({
        code: response.data.code,
        msg: response.data.msg
      });
    }
    return response.data.data;
  }, (err) => {
    return Promise.reject(err || {
      message: err.msg || err.response.data.message || '未知错误'
    });
  }
);
module.exports = util;