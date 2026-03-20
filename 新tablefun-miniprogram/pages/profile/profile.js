// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    statusBarHeight: 0,
    navBarHeight: 0,
    systemNotificationCount: 2,
    groupNotificationCount: 1,
    isAuthenticated: false
  },

  onLoad() {
    this.getSystemInfo();
    this.loadUserInfo();
    this.loadAuthStatus();
  },

  onShow() {
    this.loadUserInfo();
    this.loadAuthStatus();
  },

  onPullDownRefresh() {
    this.loadUserInfo();
    wx.stopPullDownRefresh();
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
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      wx.showToast({
        title: '编辑个人信息',
        icon: 'none'
      });
      // 跳转到编辑个人信息页面
      // wx.navigateTo({
      //   url: '/pages/edit-profile/edit-profile'
      // });
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
    }
  },

  // 跳转页面
  goToPage(e) {
    console.log('点击了菜单项', e);
    const page = e.currentTarget.dataset.page;
    console.log('页面名称:', page);

    switch(page) {
      case 'system-notification':
        wx.showToast({ title: '系统通知', icon: 'none' });
        break;
      case 'group-notification':
        wx.showToast({ title: '组局通知', icon: 'none' });
        break;
      case 'wallet-order':
        console.log('跳转到钱包订单');
        wx.navigateTo({ url: '/pages/wallet-order/wallet-order' });
        break;
      case 'script-record':
        console.log('跳转到剧本记录');
        wx.navigateTo({ url: '/pages/script-record/script-record' });
        break;
      case 'real-name-auth':
        console.log('跳转到实名认证');
        wx.navigateTo({ url: '/pages/real-name-auth/real-name-auth' });
        break;
      default:
        console.log('未知的页面:', page);
    }
  }
})
