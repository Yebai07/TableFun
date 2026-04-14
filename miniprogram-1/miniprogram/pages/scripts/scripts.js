// 初始化数据库引用
const db = wx.cloud.database()

Page({
  data: {
    scriptList: [], // 存放剧本数据的数组
    isLoading: true // 控制加载状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchScriptsData()
  },
  onShow() {
    const isReviewing = wx.getStorageSync('GLOBAL_IN_REVIEW') ?? true;
    this.setData({ inReview: isReviewing });

    if (!isReviewing) {
      this.fetchScriptsData()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.fetchScriptsData().then(() => {
      wx.stopPullDownRefresh() // 数据拉取完后停止下拉动画
    })
  },

  /**
   * 从云数据库获取剧本列表
   */
  fetchScriptsData() {
    return new Promise((resolve, reject) => {
      this.setData({ isLoading: true })
      
      db.collection('scripts')
        .get()
        .then(res => {
          console.log("[数据库读取成功]", res.data)
          this.setData({
            scriptList: res.data,
            isLoading: false
          })
          resolve()
        })
        .catch(err => {
          console.error("[数据库读取失败]", err)
          wx.showToast({ title: '加载失败，请重试', icon: 'none' })
          this.setData({ isLoading: false })
          reject(err)
        })
    })
  },

  /**
   * 点击剧本卡片，跳转到详情页
   */
  goToDetail(e) {
    // 获取我们在 wxml 中绑定的 data-id
    const scriptId = e.currentTarget.dataset.id;
    // 带着 ID 跳转到 detail 页面
    wx.navigateTo({
      url: `/pages/detail/detail?id=${scriptId}`
    })
  }
})