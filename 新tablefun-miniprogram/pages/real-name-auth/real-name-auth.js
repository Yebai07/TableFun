// pages/real-name-auth/real-name-auth.js
const app = getApp();

Page({
  data: {
    isAuthenticated: false,
    isSubmitting: false,
    statusBarHeight: 0,
    navBarHeight: 0,
    formData: {
      realName: '',
      idCard: ''
    },
    authInfo: {
      realName: '',
      idCard: '',
      authTime: ''
    }
  },

  onLoad() {
    this.getSystemInfo();
    this.loadAuthInfo();
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

  // 加载认证信息
  loadAuthInfo() {
    const authInfo = wx.getStorageSync('realNameAuth');
    if (authInfo) {
      this.setData({
        isAuthenticated: true,
        authInfo: authInfo
      });
    }
  },

  // 输入真实姓名
  onRealNameInput(e) {
    this.setData({
      'formData.realName': e.detail.value
    });
  },

  // 输入身份证号
  onIdCardInput(e) {
    this.setData({
      'formData.idCard': e.detail.value
    });
  },

  // 提交认证
  submitAuth() {
    const { realName, idCard } = this.data.formData;

    // 验证
    if (!realName) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      });
      return;
    }

    if (!idCard) {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none'
      });
      return;
    }

    // 验证身份证号格式
    const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!idCardReg.test(idCard)) {
      wx.showToast({
        title: '身份证号格式不正确',
        icon: 'none'
      });
      return;
    }

    this.setData({ isSubmitting: true });

    // 模拟提交
    setTimeout(() => {
      const authInfo = {
        realName: realName,
        idCard: idCard.replace(/(.{6})(.{8})(.{4})/, '$1********$3'),
        authTime: this.formatTime(new Date())
      };

      wx.setStorageSync('realNameAuth', authInfo);

      this.setData({
        isAuthenticated: true,
        authInfo: authInfo,
        isSubmitting: false,
        formData: {
          realName: '',
          idCard: ''
        }
      });

      wx.showToast({
        title: '认证成功',
        icon: 'success'
      });
    }, 1500);
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
})
