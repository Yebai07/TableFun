// pages/profile/profile.js
Page({

  data: {
    isRegistered: false,
    isLoading: true,
    userInfo: null,
    devMode: false,
    cachedUserInfo: null
  },

  onLoad(options) {
    const devMode = wx.getStorageSync('devMode') || false;
    this.setData({ devMode: devMode });
    
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (cachedData && cachedData.userInfo) {
      const ui = cachedData.userInfo;
      if (!ui.displayId) {
        ui.displayId = (ui._id) || (ui.openid) || '';
      }
      this.setData({ cachedUserInfo: ui });
    }
  },

  onShow() {
    const isManualLogout = wx.getStorageSync('isManualLogout');
    if (isManualLogout) {
      this.setData({ isRegistered: false, isLoading: false, userInfo: null });
      return;
    }

    const loginStatus = wx.getStorageSync('loginStatus');
    const cachedData = wx.getStorageSync('cachedUserInfo');
    
    if (loginStatus && cachedData && cachedData.userInfo) {
      this.setData({
        isRegistered: true,
        isLoading: false,
        userInfo: cachedData.userInfo
      });
      // 🚀 核心修复 1：移除 5 分钟限制，只要处于登录状态，每次切回主页都强制静默刷新
      this.silentSyncData(); 
      return;
    }

    // 没有缓存时，走严格的校验
    this.checkUserRegistered();
  },

  /**
   * 后台静默同步数据
   */
  silentSyncData() {
    const cachedData = wx.getStorageSync('cachedUserInfo');
    // 获取真实的 openid 变量
    const openid = cachedData?.userInfo?._openid || cachedData?.userInfo?.openid;
    
    if (!openid) return;

    const db = wx.cloud.database();
    // 🚀 核心修复 2：把死字符串 '{openid}' 替换为真实的 openid 变量
    db.collection('users').where({ _openid: openid }).get({
      success: (res) => {
        if (res.data && res.data.length > 0) {
          const userInfo = res.data[0];
          // 拿到最新数据（包含刚扣除的分数、最新的头像），强制覆盖本地缓存和页面
          wx.setStorageSync('cachedUserInfo', { userInfo: userInfo, timestamp: Date.now() });
          this.setData({ userInfo: userInfo });
        }
      }
    });
  },

  /**
   * 严格校验用户是否注册 (只在初次登录或清空缓存时触发)
   */
  checkUserRegistered() {
    this.setData({ isLoading: true });
    
    // 🚀 核心修复 3：因为此时没有本地缓存，必须先调用云函数拿到真实 openid，再去数据库查！
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'getOpenId' },
      success: (res) => {
        if (res.result && res.result.openid) {
          const db = wx.cloud.database();
          // 用真实的 openid 查询
          db.collection('users').where({ _openid: res.result.openid }).get({
            success: (dbRes) => {
              if (dbRes.data && dbRes.data.length > 0) {
                const userInfo = dbRes.data[0];
                wx.setStorageSync('cachedUserInfo', { userInfo: userInfo, timestamp: Date.now() });
                wx.setStorageSync('loginStatus', true);
                this.setData({ isRegistered: true, isLoading: false, userInfo: userInfo });
              } else {
                this.setData({ isRegistered: false, isLoading: false });
              }
            },
            fail: () => this.setData({ isRegistered: false, isLoading: false })
          });
        } else {
          this.setData({ isRegistered: false, isLoading: false });
        }
      },
      fail: () => this.setData({ isRegistered: false, isLoading: false })
    });
  },

  navigateToRegister() {
    wx.removeStorageSync('isManualLogout');
    this.setData({ isLoading: true });
    
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'getOpenId' },
      success: (res) => {
        if (res.result && res.result.openid) {
          const db = wx.cloud.database();
          db.collection('users').where({ _openid: res.result.openid }).get({
            success: (dbRes) => {
              if (dbRes.data && dbRes.data.length > 0) {
                const userInfo = dbRes.data[0];
                wx.setStorageSync('cachedUserInfo', { userInfo: userInfo, timestamp: Date.now() });
                wx.setStorageSync('loginStatus', true);
                this.setData({ isRegistered: true, isLoading: false, userInfo: userInfo });
                wx.showToast({ title: '欢迎回来', icon: 'success' });
              } else {
                this.setData({ isLoading: false });
                wx.navigateTo({ url: '/pages/register/register' });
              }
            }
          });
        }
      }
    });
  },

  // ---------------- 以下为页面跳转和交互方法 ----------------
  /**
   * 跳转到信用分详情页
   */
  navigateToCreditDetail() {
    wx.navigateTo({
      url: '/pages/credit-detail/credit-detail'
    });
  },
  navigateToProfileDetail() { wx.navigateTo({ url: '/pages/profile-detail/profile-detail' }); },
  navigateToSettings() { wx.navigateTo({ url: '/pages/settings/settings' }); },
  navigateToUserTags() { wx.navigateTo({ url: '/pages/user-tags/user-tags' }); },
  navigateToUserCard() {
    const openid = this.data.userInfo._openid || this.data.userInfo.openid;
    wx.navigateTo({ url: `/pages/usercard/usercard?openid=${openid}` });
  },
  navigateToProfileEdit() { wx.navigateTo({ url: '/pages/profile-edit/profile-edit' }); },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0];
        this.setData({ 'userInfo.avatarUrl': tempPath });

        wx.showLoading({ title: '上传头像...' });
        wx.cloud.uploadFile({
          cloudPath: `avatars/${Date.now()}.jpg`,
          filePath: tempPath,
          success: (upRes) => {
            wx.hideLoading();
            const fileID = upRes.fileID;
            this.setData({ 'userInfo.avatarUrl': fileID });
            const db = wx.cloud.database();
            db.collection('users').doc(this.data.userInfo._id).update({
              data: { avatarUrl: fileID },
              success: () => {
                const newUserInfo = { ...this.data.userInfo, avatarUrl: fileID };
                wx.setStorageSync('cachedUserInfo', { userInfo: newUserInfo, timestamp: Date.now() });
                wx.showToast({ title: '更换成功', icon: 'success' });
              },
              fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '头像上传失败', icon: 'none' });
          }
        });
      }
    });
  },

  evaluateUser() { wx.showToast({ title: '评价功能开发中', icon: 'none' }); },
  chatWithUser() { wx.showToast({ title: '聊天功能开发中', icon: 'none' }); },
  viewParticipatedScripts() { wx.navigateTo({ url: '/pages/participated-scripts/participated-scripts' }); },
  viewMedals() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  viewBio() { wx.showToast({ title: '功能开发中', icon: 'none' }); },

  onPullDownRefresh() {
    // 下拉强制全量刷新并校验
    this.checkUserRegistered();
    wx.stopPullDownRefresh();
  }
})