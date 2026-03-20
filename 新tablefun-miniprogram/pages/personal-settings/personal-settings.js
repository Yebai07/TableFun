// pages/personal-settings/personal-settings.js
Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 44,
    userInfo: {
      avatarUrl: '',
      nickname: '',
      gender: 0, // 0: 未设置, 1: 男, 2: 女
      signature: ''
    },
    showGenderModal: false,
    tempGender: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 0
    });
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  // 导航栏返回事件
  onBackTap() {
    wx.navigateBack();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userInfo: {
        avatarUrl: userInfo.avatarUrl || '',
        nickname: userInfo.nickname || '',
        gender: userInfo.gender || 0,
        signature: userInfo.signature || ''
      }
    });
  },

  // 性别文本
  get genderText() {
    const gender = this.data.userInfo.gender;
    if (gender === 1) return '男';
    if (gender === 2) return '女';
    return '未设置';
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'userInfo.avatarUrl': tempFilePath
        });
        wx.showToast({
          title: '头像已选择',
          icon: 'success'
        });
      }
    });
  },

  // 编辑昵称
  editNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称（最多15字）',
      content: this.data.userInfo.nickname || '',
      success: (res) => {
        if (res.confirm && res.content) {
          const nickname = res.content.trim();
          if (nickname.length > 15) {
            wx.showToast({
              title: '昵称不能超过15个字',
              icon: 'none'
            });
            return;
          }
          this.setData({
            'userInfo.nickname': nickname
          });
          wx.showToast({
            title: '昵称已修改',
            icon: 'success'
          });
        }
      }
    });
  },

  // 编辑性别
  editGender() {
    this.setData({
      showGenderModal: true,
      tempGender: this.data.userInfo.gender || 0
    });
  },

  // 选择性别
  selectGender(e) {
    const gender = parseInt(e.currentTarget.dataset.gender);
    this.setData({
      tempGender: gender
    });
  },

  // 确认性别
  confirmGender() {
    this.setData({
      'userInfo.gender': this.data.tempGender,
      showGenderModal: false
    });
    wx.showToast({
      title: '性别已设置',
      icon: 'success'
    });
  },

  // 关闭性别弹窗
  closeGenderModal() {
    this.setData({
      showGenderModal: false
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  // 编辑个性签名
  editSignature() {
    wx.showModal({
      title: '修改个性签名',
      editable: true,
      placeholderText: '请输入个性签名',
      content: this.data.userInfo.signature || '',
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            'userInfo.signature': res.content
          });
          wx.showToast({
            title: '个性签名已修改',
            icon: 'success'
          });
        }
      }
    });
  },

  // 保存设置
  saveSettings() {
    const { avatarUrl, nickname, gender, signature } = this.data.userInfo;

    // 获取存储的用户信息
    let storedUserInfo = wx.getStorageSync('userInfo') || {};
    storedUserInfo.avatarUrl = avatarUrl;
    storedUserInfo.nickname = nickname;
    storedUserInfo.gender = gender;
    storedUserInfo.signature = signature;

    // 更新存储
    wx.setStorageSync('userInfo', storedUserInfo);

    // 更新全局用户信息
    const app = getApp();
    if (app) {
      app.globalData.userInfo = storedUserInfo;
    }

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
});
