import http from 'wechat-http'

// 基础路径，同时需添加合法请求域名
http.baseURL = 'https://live-api.itheima.net'

// 请求拦截器
http.intercept.request = config => {
  // 不能直接赋值  因为 header 默认为空
  config.header = {
    Authorization: 'Bearer ' + wx.getStorageSync('token'),
    ...config.header
  }
  return config
}

// 响应拦截器，返回核心数据 data
http.intercept.response = res => {
  if (res.data.code === 10000) {
    return res.data
  } else if (res.data.code === 401) {
    const app = getApp()
    // 状态为 401 且接口为 /refreshToken 表明 refreshToken 也过期了
    if (res.config.url.includes('/refreshToken')) {
      // 获取页面栈
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      // 跳转页面 不保存上次的页面
      wx.redirectTo({
        // 记得后面+  /
        url: '/pages/login/index?redirectUrl=/' + page.route
      })
      return
    }
    const res2 = wx.utils.http.post('/refreshToken', {}, {
      header: {
        Authorization: 'Bearer ' + wx.getStorageSync('refreshToken')
      }
    })
    app.setToken('token', res2.data.token)
    app.setToken('refreshToken', res2.data.refreshToken)

    // 修改新的 token
    res.config.header = {
      Authorization: 'Bearer ' + wx.getStorageSync('token')
    }
    // 通过新的 token 重新发送请求
    return http(res.config)
  } else {
    // 出错 进行提示
    wx.utils.toast(res.data.message || '业务错误')
    // 主动返回错误的 Promise 不执行业务 await 后面的代码
    return Promise.reject(res.data)
  }
}

export default http
