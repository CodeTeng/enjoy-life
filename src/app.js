// app.js
// 将工具类挂载到 wx App
import utils from './utils/utils'
wx.utils = utils

App({
  globalData: {},
})
