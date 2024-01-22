const utils = {
  toast(title = '数据加载失败...') {
    wx.showToast({
      title,
      mask: true,
      icon: 'none'
    })
  }
}

// 导出
export default utils
