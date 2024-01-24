import wxValidate from 'wechat-validate'

Page({
  behaviors: [wxValidate],
  data: {
    id: undefined,
    currentDate: new Date().getTime(),
    houseLayerVisible: false,
    repairLayerVisible: false,
    dateLayerVisible: false,
    houseList: [],
    houseId: '',
    houseInfo: '',
    repairList: [],
    repairItemId: '',
    repairItemName: '',
    mobile: '',
    description: '',
    appointment: '',
    attachment: []
  },
  rules: {
    houseId: [{ required: true, message: '请选择报修房屋!' }],
    repairItemId: [{ required: true, message: '请选择维修的项目!' }],
    mobile: [
      { required: true, message: '请填写手机号码!' },
      { pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号码!' }
    ],
    appointment: [{ required: true, message: '请选择预约日期!' }],
    description: [{ required: true, message: '请填写问题描述!' }]
  },
  async onLoad({ id }) {
    if (id) {
      // 修改报修信息
      const res = await wx.http.get(`/repair/${id}`)
      console.log(res)
      this.setData({...res.data})
      wx.setNavigationBarTitle({
        title: '修改报修信息'
      })
    } else {
      // 添加报修信息
      wx.setNavigationBarTitle({
        title: '填写报修信息'
      })
    }
  },
  async submitForm() {
    if (!this.validate()) return
    const { id, houseId, repairItemId, mobile, appointment, description, attachment } = this.data
    await wx.http.post('/repair', {
      id,
      houseId,
      repairItemId,
      mobile,
      appointment,
      description,
      attachment
    })
    wx.redirectTo({
      url: '/repair_pkg/pages/list/index'
    })
  },
  async getAdoptHouseList() {
    const res = await wx.http.get('/house')
    this.setData({
      houseList: res.data
    })
  },
  async getRepairList() {
    const res = await wx.http.get('/repairItem')
    this.setData({
      repairList: res.data
    })
  },
  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
    this.getAdoptHouseList()
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },
  onSelectHouse(event) {
    this.setData({
      houseId: event.detail.id,
      houseInfo: event.detail.name
    })
  },
  openRepairLayer() {
    this.setData({ repairLayerVisible: true })
    this.getRepairList()
  },
  closeRepairLayer() {
    this.setData({
      repairLayerVisible: false
    })
  },
  onSelectRepair(event) {
    this.setData({
      repairItemId: event.detail.id,
      repairItemName: event.detail.name
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
      appointment: wx.utils.formatDate(ev.detail),
      // appointment: date.toLocaleDateString('zh-CN').replaceAll('/', '-'),
      dateLayerVisible: false
    })
  },
  async afterRead(event) {
    const { file } = event.detail
    const res = await wx.http.upload('/upload', {
      name: 'file',
      filePath: file.tempFilePath
    })
    this.setData({
      attachment: [...this.data.attachment, res.data]
    })
  },
  beforeRead(event) {
    const { file, callback } = event.detail
    if (file.size > 2 * 1024 * 1024) {
      wx.utils.toast('图片大小不能超过2M')
      callback(false)
    }
    callback(true)
  },
  deletePic(event) {
    const targetIndex = event.detail.index
    this.setData({
      attachment: this.data.attachment.filter((v, index) => index !== targetIndex)
    })
  },
  goList() {
    wx.reLaunch({
      url: '/repair_pkg/pages/list/index'
    })
  }
})
