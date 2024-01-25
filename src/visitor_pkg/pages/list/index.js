// 导入 licia 提供的节流函数
import { throttle } from 'miniprogram-licia'

Page({
  data: {
    visitorList: [],
    isFirstLoad: true
  },
  onLoad() {
    // 事件回调函数
    this.getMoreVisitor = throttle(() => {
      // 没有更多数据了...
      if (!this.data.hasMore) return
      // 创建了节流函数
      this.getVisitorList(++this._current)
    }, 100)
    // 获取访客列表
    this.getVisitorList()
  },
  async getVisitorList(current = 1, pageSize = 5) {
    // 调用接口
    const { data: { pageTotal, rows: visitorList } } = await wx.http.get('/visitor', { current, pageSize })
    // 渲染数据
    this.setData({
      hasMore: current < pageTotal,
      visitorList: this.data.visitorList.concat(visitorList),
      isFirstLoad: false
    })
    // 记录下来当前的页面
    this._current = current
  },
  getMoreVisitor() {

  },
  goPassport() {
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index'
    })
  }
})
