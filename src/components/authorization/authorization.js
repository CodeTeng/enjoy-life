Component({
  properties: {},
  data: {
    isLogin: false
  },
  methods: {},
  lifetimes: {
    attached() {
      const app = getApp()
      const isLogin = Boolean(app.token)
      this.setData({
        isLogin
      })
      if (!isLogin) {
        // 获取页面栈
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        // 跳转到登录页  保存上次的页面 可以返回
        // wx.navigateTo({
        //   url: '/pages/login/index'
        // })
        // 跳转页面 不保存上次的页面
        wx.redirectTo({
          // 记得后面+  /
          url: '/pages/login/index?redirectUrl=/' + page.route
        })
      }
    }
  }
})
