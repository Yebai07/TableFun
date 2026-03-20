// pages/wallet-order/wallet-order.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    statusBarHeight: 0,
    navBarHeight: 0,
    transactions: []
  },

  onLoad() {
    this.getSystemInfo();
    this.loadUserInfo();
    this.loadTransactions();
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
      this.setData({
        userInfo: {
          coins: 1000
        }
      });
    }
  },

  // 加载交易记录
  loadTransactions() {
    const transactions = wx.getStorageSync('transactions') || [];
    this.setData({ transactions });
  },

  // 充值
  recharge() {
    wx.showModal({
      title: '充值',
      content: '请选择充值金额\n\n100金币 = 1元',
      editable: false,
      confirmText: '立即充值',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '充值功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 返回
  goBack() {
    console.log('点击了返回键');
    wx.navigateBack({
      success: () => {
        console.log('返回成功');
      },
      fail: (err) => {
        console.log('返回失败', err);
      }
    });
  }
})
