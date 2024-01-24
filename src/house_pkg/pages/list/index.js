Page({
  data: {
    dialogVisible: false,
    roomList: [],
    isFirstLoad: true
  },

  onShow() {
    this.getRoomList()
  },

  async getRoomList() {
    const res = await wx.http.get('/room')
    this.setData({
      roomList: res.data,
      isFirstLoad: false
    })
  },

  swipeClose(ev) {
    const { position, instance } = ev.detail
    // 也可以用原生wx小程序的对话框
    if (position === 'right') {
      // 显示 Dialog 对话框
      this.setData({
        dialogVisible: true
      })
      this.cellId = ev.mark.id
      // swiper-cell 滑块关闭
      instance.close()
    }
  },
  async dialogClose(ev) {
    if (ev.detail === 'confirm') {
      await wx.http.delete(`/room/${this.cellId}`)
      // 换一种方式 进行乐观 UI 更新
      this.setData({
        roomList: this.data.roomList.filter(item => item.id !== this.cellId)
      })
    }
  },

  goDetail(ev) {
    wx.navigateTo({
      url: '/house_pkg/pages/detail/index?id=' + ev.mark.id
    })
  },

  addHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index'
    })
  }
})
