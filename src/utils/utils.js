const utils = {
  toast(title = '数据加载失败...') {
    wx.showToast({
      title,
      mask: true,
      icon: 'none'
    })
  },
  formatDate(date) {
    date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    return [year, month, day].map(item => item < 10 ? '0' + item : item).join('-')
  }
}

// 导出
export default utils
