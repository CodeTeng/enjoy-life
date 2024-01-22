// app.js
import utils from './utils/utils'
import http from './utils/http'

// 将工具类挂载到 wx App
wx.utils = utils
wx.http = http

App({
  globalData: {},
})
