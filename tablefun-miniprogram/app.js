App({
  globalData: {
    userInfo: null,
    userId: null,
    currentRoom: null,
    currentScript: null,
    socketStatus: 'closed',
    teammateList: [
      { id: 'tm001', nickname: '剧本杀大神' }, // 删掉avatarUrl字段
      { id: 'tm002', nickname: '新手求带飞' },
      { id: 'tm003', nickname: '熬夜玩本选手' }
    ]
  },

  onLaunch() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.userId = userInfo.id;
    }
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.userId = userInfo.id;
    wx.setStorageSync('userInfo', userInfo);
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.userId = null;
    wx.removeStorageSync('userInfo');
  }
})
