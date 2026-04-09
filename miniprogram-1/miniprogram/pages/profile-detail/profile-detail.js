// pages/profile-detail/profile-detail.js
Page({
  data: {
    userInfo: null,
    dynamicCount: 23
  },

  onLoad(options) {
    this.loadFromCache();
  },

  onShow() {
    // 每次显示页面，先用缓存垫底（防白屏），然后立刻去后台拿最新数据（防旧分数）
    this.loadFromCache();
    this.silentSync(); 
  },

  loadFromCache() {
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (cachedData && cachedData.userInfo) {
      this.setData({ userInfo: cachedData.userInfo });
    } else {
      wx.showToast({ title: '用户信息不存在，请先注册', icon: 'none' });
      setTimeout(() => wx.navigateTo({ url: '/pages/register/register' }), 1000);
    }
  },

  silentSync() {
    const cachedData = wx.getStorageSync('cachedUserInfo');
    // 获取真实的 openid 变量
    const openid = cachedData?.userInfo?._openid || cachedData?.userInfo?.openid;
    
    if (!openid) return; // 如果没拿到，说明没登录，不执行查询

    const db = wx.cloud.database();
    // 🚀 核心修复 1：把死字符串换成真实的 openid 变量
    db.collection('users').where({ 
      _openid: openid 
    }).get({
      success: (res) => {
        if (res.data && res.data.length > 0) {
          const latestInfo = res.data[0];
          // 🚀 核心修复 2：把最新的数据写回缓存和页面，分数瞬间掉下来
          wx.setStorageSync('cachedUserInfo', { userInfo: latestInfo, timestamp: Date.now() });
          this.setData({ userInfo: latestInfo });
        }
      },
      fail: (err) => {
        console.error('静默刷新数据失败:', err);
      }
    });
  },

  navigateToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  navigateToUserTags() {
    wx.navigateTo({ url: '/pages/user-tags/user-tags' });
  },

  navigateBack() {
    wx.navigateBack();
  },

  evaluateUser() {
    wx.showToast({ title: '评价功能开发中', icon: 'none' });
  },

  chatWithUser() {
    wx.showToast({ title: '聊天功能开发中', icon: 'none' });
  },

  viewParticipatedScripts() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  viewMedals() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  viewBio() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});