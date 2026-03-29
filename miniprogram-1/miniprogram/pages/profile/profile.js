// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRegistered: false,
    isLoading: true,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时不自动跳转，只检查状态
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时检查用户注册状态
    this.checkUserRegistered();
  },

  /**
   * 检查用户是否已注册
   */
  checkUserRegistered() {
    this.setData({ isLoading: true });
    
    // 获取用户的openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        console.log('获取openid结果:', res);
        if (res.result && res.result.openid) {
          const openid = res.result.openid;
          this.getUserData(openid);
        } else {
          console.error('获取openid失败，返回结果异常', res);
          this.setData({ 
            isRegistered: false, 
            isLoading: false 
          });
        }
      },
      fail: (err) => {
        console.error('获取openid失败', err);
        this.setData({ 
          isRegistered: false, 
          isLoading: false 
        });
      }
    });
  },

  /**
   * 从数据库获取用户数据
   */
  getUserData(openid) {
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid: openid
    }).get({
      success: (res) => {
        if (res.data && res.data.length > 0) {
          // 用户已注册，显示个人主页内容
          console.log('用户已注册，显示个人主页');
          this.setData({
            isRegistered: true,
            isLoading: false,
            userInfo: res.data[0]
          });
        } else {
          // 用户未注册，显示注册入口
          console.log('用户未注册，显示注册入口');
          this.setData({
            isRegistered: false,
            isLoading: false
          });
        }
      },
      fail: (err) => {
        console.error('获取用户数据失败', err);
        this.setData({
          isRegistered: false,
          isLoading: false
        });
      }
    });
  },

  /**
   * 跳转到注册页面
   */
  navigateToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },

  /**
   * 跳转到个人主页详情
   */
  navigateToProfileDetail() {
    wx.navigateTo({
      url: '/pages/profile-detail/profile-detail'
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
   * 跳转到个人信息编辑页面
   */
  navigateToProfileEdit() {
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit'
    });
  },

  /**
   * 评价TA
   */
  evaluateUser() {
    wx.showToast({
      title: '评价功能开发中',
      icon: 'none'
    });
  },

  /**
   * 和TA聊
   */
  chatWithUser() {
    wx.showToast({
      title: '聊天功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看参与的剧本
   */
  viewParticipatedScripts() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看勋章
   */
  viewMedals() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看个签
   */
  viewBio() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.checkUserRegistered();
    wx.stopPullDownRefresh();
  }
})
