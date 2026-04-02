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
    db.collection('users').where({ _openid: openid }).get().then(res => {
      if (res.data.length > 0) {
        const user = res.data[0];
        this.setData({
          userInfo: user,
          displayId: (user._id || '').substring(0, 6),
          isLoading: false
        });
      }
    });
  },

  // 差分跳转逻辑
  onEditProfile() {
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' });
  },

  onEvaluate() { wx.showToast({ title: '评价功能开发中', icon: 'none' }); },
  onChat() { wx.showToast({ title: '聊天功能开发中', icon: 'none' }); }
})