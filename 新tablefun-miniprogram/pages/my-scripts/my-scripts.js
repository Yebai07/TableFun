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
      this.setData({ userInfo });
    } else {
      this.setData({ userInfo: null });
    }
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
    const page = e.currentTarget.dataset.page;
    const pages = {
      'system-notification': '系统通知',
      'group-notification': '组局通知',
      'wallet-order': '钱包订单',
      'script-record': '我的剧本记录',
      'real-name-auth': '个人实名认证'
    };

    wx.showToast({
      title: pages[page],
      icon: 'none'
    });

    // 这里可以根据不同的页面进行跳转
    // switch(page) {
    //   case 'system-notification':
    //     wx.navigateTo({ url: '/pages/system-notification/system-notification' });
    //     break;
    //   case 'group-notification':
    //     wx.navigateTo({ url: '/pages/group-notification/group-notification' });
    //     break;
    //   case 'wallet-order':
    //     wx.navigateTo({ url: '/pages/wallet-order/wallet-order' });
    //     break;
    //   case 'script-record':
    //     wx.navigateTo({ url: '/pages/script-record/script-record' });
    //     break;
    //   case 'real-name-auth':
    //     wx.navigateTo({ url: '/pages/real-name-auth/real-name-auth' });
    //     break;
    // }
  }
})
