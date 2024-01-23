Page({
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },

  data: {
    userInfo: {}
  },

  onShow() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.getUserInfo()
    }
  },

  async getUserInfo() {
    const res = await wx.http.get('/userInfo')
    this.setData({
      userInfo: res.data
    })
  }
})
