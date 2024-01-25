Page({
  data: {
    passport: {}
  },
  onLoad({ id, encryptedData }) {
    this.getPassport(id)
    this.getPassportShare(encryptedData)
  },
  async getPassport(id) {
    if (!id) return wx.utils.toast('参数错误！')
    const res = await wx.http.get(`/visitor/${id}`)
    this.setData({
      passport: res.data
    })
  },
  async getPassportShare(encryptedData) {
    if (!encryptedData) return
    const res = await wx.http.get('/visitor/share/' + encryptedData)
    this.setData({
      passport: res.data
    })
  },
  // 小程序授权检测
  authSetting() {
    wx.getSetting({
      success: ({ authSetting }) => {
        if (authSetting['scope.writePhotosAlbum'] === false) {
          wx.showModal({
            content: '请允许添加到相册',
            showCancel: false,
            success: () => {
              // 打开设置
              wx.openSetting({
                success: ({ authSetting }) => {
                  if (authSetting['scope.writePhotosAlbum']) {
                    this.saveImage()
                  }
                }
              })
            }
          })
        } else {
          this.saveImage()
        }
      }
    })
  },
  async saveImage() {
    // 1. 获取图片信息
    const { path } = await wx.getImageInfo({
      src: 'https://enjoy-plus.oss-cn-beijing.aliyuncs.com/images/share_poster.png'
    })
    // 2. 保存到系统相册
    await wx.saveImageToPhotosAlbum({
      filePath: path
    })
    wx.utils.toast('图片保存成功')
  },
  // 自定义分享
  onShareAppMessage() {
    const { encryptedData } = this.data.passport
    return {
      title: '查看通行证',
      path: '/visitor_pkg/pages/passport/index?encryptedData=' + encryptedData,
      imageUrl: 'https://enjoy-plus.oss-cn-beijing.aliyuncs.com/images/share_poster.png'
    }
  }
})
