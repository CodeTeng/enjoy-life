// map.js
import qqMap from '../../../utils/qqmapsdk'

Page({
  data: {
    repairDetail: {},
    latitude: 40.060539,
    longitude: 116.343847,
    scale: 16,
    markers: [
      {
        id: 1,
        latitude: 40.060539,
        longitude: 116.343847,
        width: 24,
        height: 32
      },
      {
        id: 2,
        latitude: 40.061539,
        longitude: 116.341847,
        iconPath: '/static/images/marker.png',
        width: 40,
        height: 40
      }
    ],
    polyline: []
  },
  async onLoad({ id }) {
    console.log(id)
    await this.getRepairDetail(id)
    this.id = id
    // 生成路线
    this.getPolyline()
  },
  // 调用位置服务（路线规划）
  getPolyline() {
    qqMap.direction({
      mode: 'bicycling',
      from: {
        latitude: '40.061539',
        longitude: '116.341847'
      },
      to: {
        latitude: '40.060539',
        longitude: '116.343847'
      },
      success: res => {
        const coors = res.result.routes[0].polyline
        const pl = []
        this.polylineAlg(coors, pl)
        this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{ points: pl, color: '#FF0000DD', width: 4 }]
        })
      }
    })
  },
  polylineAlg(coors, pl) {
    // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
    const kr = 1000000
    for (let i = 2; i < coors.length; i++) {
      coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
    }
    // 将解压后的坐标放入点串数组pl中
    for (let i = 0; i < coors.length; i += 2) {
      pl.push({ latitude: coors[i], longitude: coors[i + 1] })
    }
  },
  async getRepairDetail(id) {
    const res = await wx.http.get(`/repair/${id}`)
    this.setData({
      repairDetail: res.data
    })
  },
  editRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index?id=' + this.id
    })
  },
  async cancelRepair() {
    const { confirm } = await wx.showModal({
      content: '确定取消报修吗？'
    })
    if (confirm) {
      const id = this.id
      await wx.http.put(`/cancel/repaire/${id}`)
      wx.navigateTo({
        url: '/repair_pkg/pages/list/index'
      })
    }
  }
})
