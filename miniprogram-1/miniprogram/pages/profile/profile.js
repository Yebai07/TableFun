// pages/profile/profile.js
Page({

  data: {
    isRegistered: false,
    isLoading: true,
    userInfo: null,
    devMode: false,
    cachedUserInfo: null,
    // 新增：头像选择弹窗状态
    showAvatarPopup: false,
    // 新增：本地头像库路径（确保你的 images 文件夹里有这些图片）
    avatarList: [
      '/images/default-avatar.png',
      '/images/avatar-1.jpeg',
      '/images/avatar-2.jpeg',
      '/images/avatar-3.jpeg',
      '/images/avatar-4.jpeg',
      '/images/avatar-5.jpeg',
      '/images/avatar-6.jpeg'
    ]
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
    const isReviewing = wx.getStorageSync('GLOBAL_IN_REVIEW') ?? true; // 查不到默认 true
    this.setData({ inReview: isReviewing });
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

  /**
   * 点击头像：不再调用相机，而是打开选择弹窗
   */
  chooseAvatar() {
    this.setData({ showAvatarPopup: true });
  },

  /**
   * 关闭头像选择弹窗
   */
  closeAvatarPopup() {
    this.setData({ showAvatarPopup: false });
  },

  /**
   * 核心：选择新头像并直接存入数据库
   */
  selectAvatar(e) {
    const selectedUrl = e.currentTarget.dataset.url;
    
    // 如果选的跟现在的一样，直接关闭弹窗
    if (this.data.userInfo.avatarUrl === selectedUrl) {
      this.closeAvatarPopup();
      return;
    }

    wx.showLoading({ title: '保存中...', mask: true });
    
    const db = wx.cloud.database();
    db.collection('users').doc(this.data.userInfo._id).update({
      data: { avatarUrl: selectedUrl },
      success: () => {
        wx.hideLoading();
        
        // 1. 更新本地页面数据和缓存
        const newUserInfo = { ...this.data.userInfo, avatarUrl: selectedUrl };
        wx.setStorageSync('cachedUserInfo', { userInfo: newUserInfo, timestamp: Date.now() });
        
        // 2. 刷新UI并关闭弹窗
        this.setData({
          userInfo: newUserInfo,
          showAvatarPopup: false
        });
        
        wx.showToast({ title: '更换成功', icon: 'success' });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('更新头像失败', err);
        wx.showToast({ title: '保存失败', icon: 'none' });
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
  },
  
})