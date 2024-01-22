Page({
  data: {
    noticeList: []
  },
  onLoad() {
    this.getNoticeList()
  },
  async getNoticeList() {
    const res = await wx.http.get('/announcement')
    this.setData({
      noticeList: res.data
    })
  }
})
