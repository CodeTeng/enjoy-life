// pages/profile/index.ts
Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    this.getUserInfo()
  },

  async updateNickName(e) {
    const nickName = e.detail.value
    if (nickName === '') {
      wx.utils.toast('昵称不允许为空')
      return
    }
    await wx.http.put('/userInfo', {
      nickName
    })
  },

  async getUserInfo() {
    const res = await wx.http.get('/userInfo')
    this.setData({
      userInfo: res.data
    })
  },
  async updateAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    // 使用原生上传
    // wx.uploadFile({
    //   url: wx.http.baseURL + '/upload',
    //   header: {
    //     Authorization: 'Bearer ' + wx.getStorageSync('token')
    //   },
    //   name: 'file',
    //   filePath: avatarUrl,
    //   formData: {
    //     type: 'avatar'
    //   },
    //   success: res => {
    //     res.data = JSON.parse(res.data)
    //     this.setData({
    //       'userInfo.avatar': res.data.data.url
    //     })
    //   }
    // })
    // 使用 http 封装模块上传
    const res = await wx.http.upload('/upload', {
      name: 'file',
      filePath: avatarUrl,
      formData: {
        type: 'avatar'
      }
    })
    this.setData({
      'userInfo.avatar': res.data.url
    })
  }
})
