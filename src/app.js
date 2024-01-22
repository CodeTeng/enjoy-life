// app.js
import utils from './utils/utils'
import http from './utils/http'

// 将工具类挂载到 wx App
wx.utils = utils
wx.http = http

App({
  token: wx.getStorageSync('token'),
  refreshToken: wx.getStorageSync('refreshToken'),
  setToken(key, token) {
    this[key] = token
    wx.setStorageSync(key, token)
  },
  globalData: {},
})
