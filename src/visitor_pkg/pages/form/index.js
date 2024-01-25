import wxValidate from 'wechat-validate'

Page({
  behaviors: [wxValidate],
  data: {
    currentDate: new Date().getTime(),
    dateLayerVisible: false,
    houseLayerVisible: false,
    houseId: '',
    houseInfo: '',
    houseList: [],
    name: '',
    gender: 1,
    mobile: '',
    visitDate: ''
  },
  rules: {
    name: [
      { required: true, message: '访客姓名不能为空!' },
      { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '访客姓名只能为中文!' }
    ],
    mobile: [
      { required: true, message: '访客手机号不能为空!' },
      { pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号!' }
    ],
    visitDate: [
      { required: true, message: '访客日期不能为空!' }
    ]
  },
  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
    this.getHouseList()
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },
  async getHouseList() {
    const res = await wx.http.get('/house')
    this.setData({
      houseList: res.data
    })
  },
  onSelectHouse(event) {
    this.setData({
      houseId: event.detail.id,
      houseInfo: event.detail.name
    })
  },
  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },
  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },
  selectDate(ev) {
    this.setData({
      visitDate: wx.utils.formatDate(ev.detail),
      dateLayerVisible: false
    })
  },
  async submitForm() {
    if (!this.validate()) return
    const { houseId, name, gender, mobile, visitDate } = this.data
    const { data: { id } } = await wx.http.post('/visitor', {
      houseId, name, gender, mobile, visitDate
    })
    wx.redirectTo({
      url: '/visitor_pkg/pages/passport/index?id=' + id
    })
  }
})
