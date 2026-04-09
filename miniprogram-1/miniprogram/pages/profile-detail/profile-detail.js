// pages/profile-detail/profile-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时重新获取用户信息，确保评价后能看到更新的标签
    this.getUserInfo();
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    const db = wx.cloud.database();
    const _ = db.command;

    // 从缓存获取用户信息
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (cachedData && cachedData.userInfo) {
      this.setData({
        userInfo: cachedData.userInfo
      });
      return;
    }

    // 从数据库获取用户信息
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        if (res.result && res.result.openid) {
          const openid = res.result.openid;
          db.collection('users').where({
            _openid: openid
          }).get({
            success: (res) => {
              if (res.data && res.data.length > 0) {
                const userInfo = res.data[0];
                this.setData({
                  userInfo: userInfo
                });
              }
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
            }
          });
        }
      },
      fail: (err) => {
        console.error('获取openid失败', err);
      }
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 跳转到设置页面
   */
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  /**
   * 跳转到评价页面
   */
  navigateToRateUser() {
    wx.navigateTo({
      url: `/pages/rate-user/rate-user?openid=${this.data.userInfo._openid}`
    });
  },

  /**
   * 跳转到TA参与的剧本
   */
  navigateToScripts() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到TA的勋章
   */
  navigateToBadges() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到TA的个签
   */
  navigateToBio() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
})
