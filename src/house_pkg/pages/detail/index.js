Page({
  data: {
    roomDetail: {}
  },

  onLoad({ id }) {
    console.log(id)
    this.getRoomDetail(id)
    this.id = id
  },

  async getRoomDetail(id) {
    const res = await wx.http.get(`/room/${id}`)
    this.setData({
      roomDetail: res.data
    })
  },
  editHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/form/index?id=' + this.id,
    })
  },
})
