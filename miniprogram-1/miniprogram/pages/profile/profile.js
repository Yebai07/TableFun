// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRegistered: false,
    isLoading: true,
    userInfo: null,
    devMode: false,
    cachedUserInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查是否开启开发模式
    const devMode = wx.getStorageSync('devMode') || false;
    this.setData({ devMode: devMode });
    
    // 加载缓存的用户信息
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (cachedData && cachedData.userInfo) {
      // 确保缓存的 userInfo 包含 displayId 字段（避免在 wxml 中调用 substring）
      const ui = cachedData.userInfo;
      if (!ui.displayId) {
        // 使用完整的数据库 _id 或 openid 而不是截断为 6 位
        ui.displayId = (ui._id) || (ui.openid) || '';
      }
      this.setData({ cachedUserInfo: ui });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const profileUpdated = wx.getStorageSync('profileUpdated'); // 检查是否有强制刷新标记
    if (profileUpdated) {
      wx.removeStorageSync('profileUpdated');
      this.checkUserRegistered();
      return;
    }
  
    const isManualLogout = wx.getStorageSync('isManualLogout'); // 检查是否有手动退出登录的标记
    if (isManualLogout) {
      this.setData({
        isRegistered: false,
        isLoading: false,
        userInfo: null,
        cachedUserInfo: null
      });
      return;
    }
  
    const cachedData = wx.getStorageSync('cachedUserInfo'); // 检查本地缓存是否有效
    const loginStatus = wx.getStorageSync('loginStatus');
  
    if (loginStatus && cachedData) {
      const cacheTime = cachedData.timestamp || 0;
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000;
      
      if (now - cacheTime < cacheExpiry) {
        this.setData({
          isRegistered: true,
          isLoading: false,
          userInfo: cachedData.userInfo,
          cachedUserInfo: cachedData.userInfo
        });
        return;
      }
    }
  
    this.checkUserRegistered(); // 最核心的修复：如果没有缓存，直接去数据库静默核对
  },

  /**
   * 检查用户是否已注册（使用原生魔术变量，彻底抛弃云函数）
   */
  checkUserRegistered() {
    this.setData({ isLoading: true });
    const db = wx.cloud.database();
    
    // 直接利用微信自带的魔术变量 '{openid}' 查询自己的数据
    db.collection('users').where({
      _openid: '{openid}' 
    }).get({
      success: (res) => {
        if (res.data && res.data.length > 0) {
          // 数据库里有你的记录，静默完美登录！
          const userInfo = res.data[0];
          wx.setStorageSync('cachedUserInfo', { userInfo: userInfo, timestamp: Date.now() });
          wx.setStorageSync('loginStatus', true);
          this.setData({
            isRegistered: true,
            isLoading: false,
            userInfo: userInfo,
            cachedUserInfo: userInfo
          });
          console.log('静默登录成功！欢迎回来');
        } else {
          // 数据库里真没你，显示注册按钮
          this.setData({ isRegistered: false, isLoading: false });
        }
      },
      fail: (err) => {
        console.error('查询数据库失败', err);
        this.setData({ isRegistered: false, isLoading: false });
      }
    });
  },

  /**
   * 从数据库获取用户数据
   */
  getUserData(openid) {
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid: openid
    }).get({
      success: (res) => {
        if (res.data && res.data.length > 0) {
          // 用户已注册，显示个人主页内容
          console.log('用户已注册，显示个人主页');
          const userInfo = res.data[0];
          // 使用完整的数据库 _id 或 openid 作为显示 ID
          userInfo.displayId = (userInfo._id) || (openid) || '';
          // 缓存用户信息到本地存储，添加缓存时间戳
          // 确保 displayId 字段存在
          userInfo.displayId = userInfo._id || openid || '';
          const cachedData = {
            userInfo: userInfo,
            timestamp: Date.now()
          };
          wx.setStorageSync('cachedUserInfo', cachedData);
          // 设置登录状态
          wx.setStorageSync('loginStatus', true);
          this.setData({
            isRegistered: true,
            isLoading: false,
            userInfo: userInfo,
            cachedUserInfo: userInfo
          });
        } else {
          // 用户未注册，显示注册入口
          console.log('用户未注册，显示注册入口');
          // 清除缓存和登录状态
          wx.removeStorageSync('cachedUserInfo');
          wx.removeStorageSync('loginStatus');
          this.setData({
            isRegistered: false,
            isLoading: false
          });
        }
      },
      fail: (err) => {
        console.error('获取用户数据失败', err);
        // 清除缓存和登录状态
        wx.removeStorageSync('cachedUserInfo');
        wx.removeStorageSync('loginStatus');
        this.setData({
          isRegistered: false,
          isLoading: false
        });
      }
    });
  },

  navigateToRegister() {
    wx.removeStorageSync('isManualLogout'); // 清除手动退出标记，允许重新登录
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
                const userInfo = dbRes.data[0]; // 发现是个老用户，直接静默登录拦截去注册页
                wx.setStorageSync('cachedUserInfo', { userInfo: userInfo, timestamp: Date.now() });
                wx.setStorageSync('loginStatus', true);
                this.setData({ isRegistered: true, isLoading: false, userInfo: userInfo });
                wx.showToast({ title: '欢迎回来', icon: 'success' });
              } else {
                this.setData({ isLoading: false }); // 数据库里没这个人，放行去注册页
                wx.navigateTo({ url: '/pages/register/register' });
              }
            }
          });
        }
      }
    });
  },

  /**
   * 跳转到个人主页详情
   */
  navigateToProfileDetail() {
    wx.navigateTo({
      url: '/pages/profile-detail/profile-detail'
    });
  },

  /**
   * 跳转到设置页面
   */
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  /**
   * 跳转到用户标签页
   */
  navigateToUserTags() {
    wx.navigateTo({
      url: '/pages/user-tags/user-tags'
    });
  },
  // 增加/替换以下函数
  navigateToUserCard() {
    const openid = this.data.userInfo._openid || this.data.userInfo.openid;
    wx.navigateTo({
      url: `/pages/usercard/usercard?openid=${openid}`
    });
  },

  chooseAvatar() {
    // 1. 复刻编辑页逻辑：使用 chooseImage 获取本地临时路径 
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]; // 获取选择的路径 
        
        // 2. 立即更新界面预览，消除“卡顿感”
        this.setData({
          'userInfo.avatarUrl': tempPath
        });

        // 3. 后台静默同步数据库 
        const db = wx.cloud.database();
        db.collection('users').doc(this.data.userInfo._id).update({
          data: {
            avatarUrl: tempPath
          },
          success: () => {
            // 4. 同步更新本地缓存，确保刷新不丢失 [cite: 109]
            const newUserInfo = { ...this.data.userInfo, avatarUrl: tempPath };
            wx.setStorageSync('cachedUserInfo', { 
              userInfo: newUserInfo, 
              timestamp: Date.now() 
            });
            wx.showToast({ title: '更换成功', icon: 'success' });
          },
          fail: (err) => {
            console.error('更新头像失败', err);
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        });
      }
    });
  },
  /**
   * 跳转到个人信息编辑页面
   */
  navigateToProfileEdit() {
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit'
    });
  },

  /**
   * 评价TA
   */
  evaluateUser() {
    wx.showToast({
      title: '评价功能开发中',
      icon: 'none'
    });
  },

  /**
   * 和TA聊
   */
  chatWithUser() {
    wx.showToast({
      title: '聊天功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看参与的剧本
   */
  viewParticipatedScripts() {
    // 跳转到“参与的剧本”页面
    wx.navigateTo({
      url: '/pages/participated-scripts/participated-scripts'
    });
  },

  /**
   * 查看勋章
   */
  viewMedals() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看个签
   */
  viewBio() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.checkUserRegistered();
    wx.stopPullDownRefresh();
  }
})
