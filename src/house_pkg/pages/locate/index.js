// house_pkg/pages/locate/index.ts
import qqMap from '../../../utils/qqmapsdk'

Page({
  data: {
    list: [],
    address: ''
  },
  search({ latitude, longitude }) {
    qqMap.search({
      keyword: '住宅小区',
      page_size: 5,
      location: { latitude, longitude },
      success: res => {
        this.setData({
          list: res.data
        })
      }
    })
  },
  getAddressInfo({ latitude, longitude }) {
    qqMap.reverseGeocoder({
      location: { latitude, longitude },
      success: res => {
        this.setData({
          address: res.result.address
        })
      }
    })
  },
  async chooseLocation() {
    const { name, latitude, longitude } = await wx.chooseLocation()
    this.setData({
      address: name
    })
    // 重新获取附近的小区
    this.search({ latitude, longitude })
  },
  async onLoad() {
    // 获取当前位置
    const { latitude, longitude } = await wx.getLocation({
      type: 'gcj02'
    })
    this.search({ latitude, longitude })
    this.getAddressInfo({ latitude, longitude })
  }
})
