import wxValidate from 'wechat-validate'

Page({
  behaviors: [wxValidate],
  data: {
    id: undefined,
    point: '',
    building: '',
    room: '',
    name: '',
    gender: 1,
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: ''
  },
  rules: {
    name: [
      { required: true, message: '业主姓名不能为空!' },
      { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '业主姓名只能为中文!' }
    ],
    mobile: [
      { required: true, message: '业主手机号不能为空!' },
      { pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号!' }
    ],
    idcardFrontUrl: [{ required: true, message: '请上传身份证正面!' }],
    idcardBackUrl: [{ required: true, message: '请上传身份证国徽面!' }]
  },
  async submitForm() {
    if (!this.validate()) return
    // 小程序和Vue不一样 会添加一些其它数据
    // eslint-disable-next-line no-unused-vars
    const { __webviewId__, status, ...body } = this.data
    await wx.http.post('/room', body)
    // 回退到列表页 回退4级  有id为编辑
    wx.navigateBack({
      delta: body.id ? 2 : 4
    })
  },
  async uploadPicture(e) {
    const { type } = e.mark
    const { tempFiles } = await wx.chooseMedia({
      count: 1,
      mediaType: ['image']
    })
    const size = tempFiles[0].size
    if (2 * 1024 * 1024 < size) {
      return wx.utils.toast('图片大小不能超过2M')
    }
    // 上传图片
    const res = await wx.http.upload('/upload', {
      name: 'file',
      filePath: tempFiles[0].tempFilePath
    })
    this.setData({
      // 对象中的插值语法 用 [] 动态表示
      [type]: res.data.url
    })
  },
  async onLoad({ point, building, room, id }) {
    if (id) {
      // 修改房屋信息
      const res = await wx.http.get(`/room/${id}`)
      this.setData({ ...res.data })
      wx.setNavigationBarTitle({
        title: '编辑房屋信息'
      })
    } else {
      // 获取房屋信息数据
      this.setData({ point, building, room })
      wx.setNavigationBarTitle({
        title: '添加房屋信息'
      })
    }
  },
  goList() {
    wx.reLaunch({
      url: '/house_pkg/pages/list/index'
    })
  },
  removePicture(ev) {
    // 移除图片的类型（身份证正面或反面）
    const type = ev.mark?.type
    this.setData({ [type]: '' })
  }
})
