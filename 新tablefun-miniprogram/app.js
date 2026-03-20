App({
  globalData: {
    userInfo: null,
    userId: null,
    currentRoom: null,
    currentScript: null,
    socketStatus: 'closed',
    searchKeyword: ''
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
  },

  // 增加金币
  addCoins(amount) {
    const userInfo = this.globalData.userInfo;
    if (!userInfo) {
      return false;
    }
    userInfo.coins = (userInfo.coins || 1000) + amount;
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
    return true;
  },

  // 减少金币
  reduceCoins(amount) {
    const userInfo = this.globalData.userInfo;
    if (!userInfo) {
      return false;
    }
    const currentCoins = userInfo.coins || 1000;
    if (currentCoins < amount) {
      return false; // 金币不足
    }
    userInfo.coins = currentCoins - amount;
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
    return true;
  },

  // 获取当前金币数
  getCoins() {
    const userInfo = this.globalData.userInfo;
    if (!userInfo) {
      return 1000;
    }
    return userInfo.coins || 1000;
  }
})
