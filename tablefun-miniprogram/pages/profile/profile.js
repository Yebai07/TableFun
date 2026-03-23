// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    stats: {
      playCount: 0,
      winCount: 0,
      roomCount: 0,
      collectCount: 0,
      exp: 0,
      achievementCount: 0,
      coins: 1000
    },
    levelPercent: 0
  },
  // 新增：跳转到私信列表
goToChatList() {
  wx.navigateTo({
    url: '/pages/chat-list/chat-list'
  });
},
  onLoad() {
    this.ensureLogin();
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  // 确保登录状态
  ensureLogin() {
    if (!app.globalData.userInfo) {
      const mockUserInfo = {
        id: 'mock_user_001',
        nickname: '桌友小王',
        avatarUrl: '/images/default-avatar.png',
        level: 3,
        exp: 250,
        coins: 1000,
        createTime: new Date().getTime()
      };
      app.setUserInfo(mockUserInfo);
    }
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({ userInfo });
      this.loadUserStats();
    } else {
      this.setData({ userInfo: null });
    }
  },

  // 加载用户统计
  loadUserStats() {
    const myRooms = wx.getStorageSync('myRooms') || [];
    const collectedScripts = wx.getStorageSync('collectedScripts') || [];
    const playHistory = wx.getStorageSync('playHistory') || [];
    const achievements = wx.getStorageSync('achievements') || [];
    const userInfo = app.globalData.userInfo || {};
    const level = userInfo.level || 1;
    const exp = userInfo.exp || 0;

    const nextLevelExp = this.getNextLevelExp(level);
    const levelPercent = Math.floor((exp / nextLevelExp) * 100);

    this.setData({
      stats: {
        playCount: playHistory.length,
        winCount: playHistory.filter(p => p.isWin).length,
        roomCount: myRooms.length,
        collectCount: collectedScripts.length,
        exp,
        achievementCount: achievements.length,
        coins: userInfo.coins || 1000
      },
      levelPercent
    });
  },

  // 处理登录
  handleLogin(e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;

      // 生成用户ID
      const userId = 'user_' + Date.now();

      // 构建用户数据
      const userData = {
        id: userId,
        nickname: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        level: 1,
        exp: 0,
        coins: 1000,
        createTime: new Date().getTime()
      };

      // 保存到全局和本地存储
      app.setUserInfo(userData);

      // 刷新页面
      this.setData({
        userInfo: userData
      });
      this.loadUserStats();

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    }
  },

  // 处理退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearUserInfo();
          this.setData({
            userInfo: null,
            stats: {
              playCount: 0,
              winCount: 0,
              roomCount: 0,
              collectCount: 0,
              exp: 0,
              achievementCount: 0,
              coins: 0
            },
            levelPercent: 0
          });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 编辑头像
  editAvatar() {
    wx.showToast({
      title: '编辑头像功能开发中',
      icon: 'none'
    });
  },

  // 编辑资料
  editProfile() {
    wx.showToast({
      title: '编辑资料功能开发中',
      icon: 'none'
    });
  },

  // 获取等级名称
  getLevelName(level) {
    const names = ['新手', '初学者', '业余', '进阶', '高手', '大师', '宗师', '传奇', '神', '超神'];
    return names[Math.min(level - 1, names.length - 1)];
  },

  // 获取下一级所需经验
  getNextLevelExp(level) {
    return level * 100;
  },

  // 跳转页面
  goToPage(e) {
    const page = e.currentTarget.dataset.page;
    const pages = {
      'my-rooms': '我的房间',
      'game-history': '游戏记录',
      'achievements': '成就系统',
      'wallet': '我的钱包',
      'settings': '设置',
      'feedback': '意见反馈',
      'about': '关于我们'
    };

    wx.showToast({
      title: pages[page],
      icon: 'none'
    });
  }
})
