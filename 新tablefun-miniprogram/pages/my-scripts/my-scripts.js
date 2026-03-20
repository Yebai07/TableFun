// pages/my-scripts/my-scripts.js
const app = getApp();

Page({
  data: {
    currentCity: '北京',
    userInfo: null,
    statusBarHeight: 0,
    navBarHeight: 0,
    systemNotificationCount: 2,
    groupNotificationCount: 1,
    isAuthenticated: false
  },

  onLoad() {
    this.loadCurrentCity();
    this.getSystemInfo();
    this.loadUserInfo();
    // this.loadAuthStatus();
  },

  // 加载当前城市
  loadCurrentCity() {
    const currentCity = app.globalData.currentCity || '北京';
    this.setData({ currentCity });
  },

  // 显示城市选择器
  showCitySelector() {
    wx.showToast({
      title: '选择城市',
      icon: 'none'
    });
    // 可以在这里调用全局的城市选择器或跳转到城市选择页面
  },

  onShow() {
    this.loadUserInfo();
    // this.loadAuthStatus();
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    // 计算导航栏高度
    const navBarHeight = menuButtonInfo.top + menuButtonInfo.height - statusBarHeight + 10;

    this.setData({
      statusBarHeight,
      navBarHeight
    });
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      // 确保有金币数据
      if (typeof userInfo.coins === 'undefined') {
        userInfo.coins = 1000;
      }
      // 从 storage 中获取最新的金币数
      const storedUserInfo = wx.getStorageSync('userInfo');
      if (storedUserInfo && storedUserInfo.coins) {
        userInfo.coins = storedUserInfo.coins;
      }
      this.setData({ userInfo });
    } else {
      // 即使没有登录，也显示默认金币数
      this.setData({
        userInfo: {
          nickname: '未登录',
          avatarUrl: '/images/default-avatar.png',
          coins: 1000
        }
      });
    }
  },

  // 加载认证状态
  loadAuthStatus() {
    const authInfo = wx.getStorageSync('realNameAuth');
    this.setData({
      isAuthenticated: !!authInfo
    });
  },

  // 编辑个人信息
  editPersonalInfo() {
    wx.navigateTo({
      url: '/pages/personal-settings/personal-settings'
    });
  },

  // 跳转页面
  goToPage(e) {
    const page = e.currentTarget.dataset.page;

    switch(page) {
      case 'system-notification':
        wx.showToast({ title: '系统通知', icon: 'none' });
        break;
      case 'group-notification':
        wx.showToast({ title: '组局通知', icon: 'none' });
        break;
      case 'wallet-order':
        wx.navigateTo({ url: '/pages/wallet-order/wallet-order' });
        break;
      case 'script-record':
        wx.navigateTo({ url: '/pages/script-record/script-record' });
        break;
      case 'real-name-auth':
        wx.navigateTo({ url: '/pages/real-name-auth/real-name-auth' });
        break;
    }
  }
})
