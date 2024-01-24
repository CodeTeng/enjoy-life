Page({
  data: {
    repairList: [],
    isFirstLoading: true
  },

  onShow() {
    this.getRepairList()
  },

  async getRepairList() {
    const res = await wx.http.get('/repair', { current: 1, pageSize: 10 })
    this.setData({
      repairList: res.data.rows,
      isFirstLoading: false
    })
  },
  goDetail(ev) {
    wx.navigateTo({
      url: '/repair_pkg/pages/detail/index?id=' + ev.mark.id
    })
  },
  addRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index'
    })
  }
})
