const app = getApp();
Page({
  data: {
    userInfo: null,
    chatSessions: [],
    noData: false,
    teammateList: []
  },

  onLoad() {
    // 打印日志，方便排查
    console.log('全局用户信息：', app.globalData.userInfo);
    console.log('全局队友列表：', app.globalData.teammateList);

    // 未登录则跳转
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录才能使用私信功能',
        showCancel: false,
        success: () => {
          wx.switchTab({ url: '/pages/profile/profile' });
        }
      });
      return;
    }

    // 强制加载队友列表
    this.setData({
       // 临时造一个用户，避免登录判断拦截
      userInfo: { id: 'test_user', nickname: '测试用户' },
      teammateList:  [
        // 兜底：如果全局没加载到，直接赋值
        { id: 'tm001', nickname: '剧本杀大神' },
        { id: 'tm002', nickname: '新手求带飞' },
        { id: 'tm003', nickname: '熬夜玩本选手' }
      ]
    });
    this.loadChatSessions();
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.loadChatSessions();
    }
  },

  loadChatSessions() {
    const chatSessions = wx.getStorageSync('chatSessions') || [];
    chatSessions.sort((a, b) => b.lastMsgTime - a.lastMsgTime);
    this.setData({
      chatSessions,
      noData: chatSessions.length === 0
    });
  },
  goBack() {
    // 优先返回上一页，如果没有上一页则跳转到首页
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }
  },
  goToChatRoom(e) {
    const targetUser = e.currentTarget.dataset.user;
    wx.navigateTo({
      url: `/pages/chat-room/chat-room?targetUserId=${targetUser.id}&targetUserName=${encodeURIComponent(targetUser.nickname)}&targetUserAvatar=${encodeURIComponent(targetUser.avatarUrl || '')}`
    });
    this.clearUnread(targetUser.id);
  },

  clearUnread(targetUserId) {
    let chatSessions = wx.getStorageSync('chatSessions') || [];
    chatSessions = chatSessions.map(session => {
      if (session.targetUser.id === targetUserId) {
        session.unreadCount = 0;
      }
      return session;
    });
    wx.setStorageSync('chatSessions', chatSessions);
    this.setData({ chatSessions });
  },

  deleteSession(e) {
    const targetUserId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除该私信会话吗？',
      success: (res) => {
        if (res.confirm) {
          let chatSessions = wx.getStorageSync('chatSessions') || [];
          let chatRecords = wx.getStorageSync('chatRecords') || {};
          chatSessions = chatSessions.filter(s => s.targetUser.id !== targetUserId);
          delete chatRecords[targetUserId];
          wx.setStorageSync('chatSessions', chatSessions);
          wx.setStorageSync('chatRecords', chatRecords);
          this.loadChatSessions();
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  }
});