import validate from 'wechat-validate'

Page({
  // 通过 behaviors 注入 validate 方法
  behaviors: [validate],
  data: {
    countDownVisible: false,
    mobile: '',
    code: ''
  },
  // 定义表单数据的验证规则
  rules: {
    mobile: [
      { required: true, message: '请填写手机号码!' },
      { pattern: /^1[3-9]\d{9}$/, message: '请检查手机号码是否正确!' }
    ],
    code: [
      { required: true, message: '请填写短信验证码!' },
      { pattern: /^\d{6}$/, message: '请检查短信验证码是否正确!' }
    ]
  },
  onLoad(query) {
    this.redirectUrl = query.redirectUrl
  },
  async getSMSCode() {
    const { valid, message } = this.validate('mobile')
    if (!valid) {
      wx.utils.toast(message)
      return
    }
    this.setData({
      countDownVisible: true
    })
    const res = await wx.http.get('/code', {
      mobile: this.data.mobile
    })
    console.log(res)
  },
  async onSubmit() {
    if (!this.validate()) return
    const { mobile, code } = this.data
    const res = await wx.http.post('/login', { mobile, code })
    console.log(res)
    const app = getApp()
    app.setToken('token', res.data.token)
    app.setToken('refreshToken', res.data.refreshToken)
    // 重定向到上次页面
    wx.redirectTo({
      url: this.redirectUrl
    })
  },
  countDownChange(ev) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.minutes === 1 || ev.detail.seconds > 0
    })
  }
})
