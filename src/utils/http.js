import http from 'wechat-http'

// 基础路径，同时需添加合法请求域名
http.baseURL = 'https://live-api.itheima.net'

// 请求拦截器
http.intercept.request = config => {
  // 不能直接赋值  因为 header 默认为空
  config.header = {
    Authorization:  'Bearer '+ wx.getStorageSync('token'),
    ...config.header
  }
  return config
}

// 响应拦截器，返回核心数据 data
http.intercept.response = res => {
  if (res.data.code !== 10000) {
    // 出错 进行提示
    wx.utils.toast(res.data.message || '业务错误')
    // 主动返回错误的 Promise 不执行业务 await 后面的代码
    return Promise.reject(res.data)
  }
  return res.data
}

export default http
