const db = wx.cloud.database()

Page({
  data: {
    userInfo: {},
    displayId: '',
    isLoading: true,
    isMe: false // 标记是否为本人
  },

  onLoad(options) {
    const targetOpenid = options.openid;
    
    // 从缓存获取当前登录用户的 OpenID
    const cachedData = wx.getStorageSync('cachedUserInfo');
    const myOpenid = cachedData?.userInfo?._openid || cachedData?.userInfo?.openid;

    this.setData({ isMe: targetOpenid === myOpenid });
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.isMe ? '我的名片' : '玩家名片'
    });

    this.fetchUserInfo(targetOpenid);
  },

  fetchUserInfo(openid) {
    console.log('开始获取用户信息', openid);
    db.collection('users').where({ _openid: openid }).get().then(res => {
      console.log('获取用户信息结果', res);
      if (res.data.length > 0) {
        const user = res.data[0];
        console.log('用户信息', user);
        this.setData({
          userInfo: user,
          displayId: (user._id || '').substring(0, 6),
          isLoading: false
        });
      } else {
        console.error('未找到用户信息', openid);
      }
    }).catch(err => {
      console.error('获取用户信息失败', err);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时重新获取用户信息，确保评价后能看到更新的标签
    if (this.data.userInfo._openid) {
      this.fetchUserInfo(this.data.userInfo._openid);
    }
  },

  // 差分跳转逻辑
  onEditProfile() {
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' });
  },

  onEvaluate() { wx.navigateTo({ url: `/pages/rate-user/rate-user?openid=${this.data.userInfo._openid}` }); },
  onChat() { wx.showToast({ title: '聊天功能开发中', icon: 'none' }); }
})