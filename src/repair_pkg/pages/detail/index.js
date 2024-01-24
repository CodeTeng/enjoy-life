// map.js
Page({
  data: {
    repairDetail: {},
    latitude: 40.060539,
    longitude: 116.343847,
  },
  onLoad({ id }) {
    this.getRepairDetail(id)
    this.id = id
  },
  async getRepairDetail(id) {
    const res = await wx.http.get(`/repair/${id}`)
    this.setData({
      repairDetail: res.data
    })
  },
  editRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index?id=' + this.id,
    })
  },
  async cancelRepair() {
    const { confirm } = await wx.showModal({
      content: '确定取消报修吗？',
    })
    if (confirm) {
      const id = this.id
      await wx.http.put(`/cancel/repaire/${id}`)
      wx.navigateTo({
        url: '/repair_pkg/pages/list/index',
      })
    }
  }
})
