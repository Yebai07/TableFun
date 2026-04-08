// pages/credit-detail/credit-detail.js
Page({
  data: {
    userInfo: null,
    creditScore: 800,
    creditRecords: [],
    isLoading: true
  },

  onLoad() {
    this.loadCreditData()
  },

  onPullDownRefresh() {
    this.loadCreditData()
    wx.stopPullDownRefresh()
  },

  loadCreditData() {
    // 从缓存获取当前用户信息
    const cachedData = wx.getStorageSync('cachedUserInfo')
    if (!cachedData || !cachedData.userInfo) {
      this.setData({ isLoading: false })
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const userInfo = cachedData.userInfo
    const currentScore = userInfo.creditScore || 800

    // 只显示初始信用分记录
    const records = [
      {
        id: 1,
        type: 'init',
        title: '初始信用分',
        change: '+800',
        score: 800,
        time: '注册时',
        description: '新用户注册获得初始信用分'
      }
    ]

    // 如果用户有信用分记录则使用用户的，否则显示初始记录
    const displayRecords = (userInfo.creditRecords && userInfo.creditRecords.length > 0) ? userInfo.creditRecords : records

    // 一次性设置所有数据，减少渲染次数
    this.setData({
      userInfo: userInfo,
      creditScore: currentScore,
      creditRecords: displayRecords,
      isLoading: false
    })
  },

  // 查看信用分规则
  viewCreditRules() {
    wx.navigateTo({
      url: '/pages/credit-rules/credit-rules'
    })
  }
})
