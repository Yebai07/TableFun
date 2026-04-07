// pages/profile-detail/profile-detail.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    dynamicCount: 23
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    // 获取用户的openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        if (res.result && res.result.openid) {
          const openid = res.result.openid;
          // 从云数据库获取数据
          const db = wx.cloud.database();
          db.collection('users').where({
            _openid: openid
          }).get({
            success: (res) => {
              if (res.data && res.data.length > 0) {
                this.setData({
                  userInfo: res.data[0]
                });
              } else {
                console.error('用户信息不存在，请先注册');
                wx.showToast({
                  title: '用户信息不存在，请先注册',
                  icon: 'none'
                });
                // 跳转到注册页面
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/register/register'
                  });
                }, 1000);
              }
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
              wx.showToast({
                title: '获取用户信息失败',
                icon: 'none'
              });
            }
          });
        } else {
          console.error('获取openid失败，返回结果异常', res);
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('获取openid失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
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
   * 跳转到用户标签页
   */
  navigateToUserTags() {
    wx.navigateTo({
      url: '/pages/user-tags/user-tags'
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 评价TA
   */
  navigateToRateUser() {
    wx.navigateTo({
      url: '/pages/rate-user/rate-user'
    });
  },

  /**
   * 跳转到修改资料页面
   */
  navigateToProfileEdit() {
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit'
    });
  },

  /**
   * 和TA聊
   */
  chatWithUser() {
    // 聊天功能逻辑
    wx.showToast({
      title: '聊天功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看TA参与的剧本
   */
  viewParticipatedScripts() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看TA的勋章
   */
  viewMedals() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看TA的个签
   */
  viewBio() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查是否有缓存的用户信息
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (cachedData) {
      // 检查缓存是否过期（5分钟）
      const cacheTime = cachedData.timestamp || 0;
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000; // 5分钟
      
      if (now - cacheTime < cacheExpiry) {
        // 缓存未过期，使用缓存数据
        this.setData({
          userInfo: cachedData.userInfo
        });
        return;
      }
    }
    
    // 缓存过期或不存在，重新从数据库获取数据
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})