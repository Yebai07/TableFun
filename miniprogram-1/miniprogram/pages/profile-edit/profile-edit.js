// pages/profile-edit/profile-edit.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    nickname: '',
    avatarUrl: '',
    bio: '',
    gender: 1,
    mbti: '',
    tags_self: [],
    customTag: '',
    processedTags: [],
    availableTags: [
      '剧本杀大神', '社交达人', '细节控', '气氛烘托者',
      '反串爱好者', '新手护航者', '复盘小能手', '人形测谎仪'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    // 先检查缓存的用户信息
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (cachedData && cachedData.userInfo) {
      const userInfo = cachedData.userInfo;
      const tags_self = userInfo.tags_self || [];
      this.setData({
        userInfo: userInfo,
        nickname: userInfo.nickname || '',
        avatarUrl: userInfo.avatarUrl || '/images/default-avatar.png',
        bio: userInfo.bio || '',
        gender: userInfo.gender || 1,
        mbti: userInfo.mbti || '',
        tags_self: tags_self,
        processedTags: this.processTags(tags_self)
      });
      return;
    }
    
    // 如果没有缓存，从数据库获取
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        if (res.result && res.result.openid) {
          const openid = res.result.openid;
          this.getUserData(openid);
        } else {
          console.error('获取openid失败，返回结果异常', res);
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('获取openid失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
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
          const userInfo = res.data[0];
          const tags_self = userInfo.tags_self || [];
          this.setData({
            userInfo: userInfo,
            nickname: userInfo.nickname || '',
            avatarUrl: userInfo.avatarUrl || '/images/default-avatar.png',
            bio: userInfo.bio || '',
            gender: userInfo.gender || 1,
            mbti: userInfo.mbti || '',
            tags_self: tags_self,
            processedTags: this.processTags(tags_self)
          });
        } else {
          // 如果没有用户数据，初始化空的标签
          this.setData({
            tags_self: [],
            processedTags: this.processTags([])
          });
        }
      },
      fail: (err) => {
        console.error('获取用户数据失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
        // 失败时也初始化空的标签
        this.setData({
          tags_self: [],
          processedTags: this.processTags([])
        });
      }
    });
  },

  /**
   * 处理标签数据，为每个标签添加selected属性
   */
  processTags(selectedTags) {
    const availableTags = this.data.availableTags;
    return availableTags.map(tag => ({
      name: tag,
      selected: selectedTags.includes(tag)
    }));
  },

  /**
   * 输入昵称
   */
  inputNickname(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  /**
   * 选择头像
   */
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          avatarUrl: res.tempFilePaths[0]
        });
      }
    });
  },

  /**
   * 输入个性签名
   */
  inputBio(e) {
    this.setData({
      bio: e.detail.value
    });
  },

  /**
   * 选择性别
   */
  chooseGender(e) {
    this.setData({
      gender: e.detail.value
    });
  },

  /**
   * 输入MBTI
   */
  inputMbti(e) {
    this.setData({
      mbti: e.detail.value
    });
  },

  /**
   * 选择标签
   */
  selectTag(e) {
    const tag = e.currentTarget.dataset.tag;
    let tags_self = [...this.data.tags_self];
    if (tags_self.includes(tag)) {
      tags_self = tags_self.filter(item => item !== tag);
    } else {
      tags_self.push(tag);
    }
    this.setData({
      tags_self: tags_self,
      processedTags: this.processTags(tags_self)
    });
  },

  /**
   * 输入自定义标签
   */
  inputCustomTag(e) {
    this.setData({
      customTag: e.detail.value
    });
  },

  /**
   * 添加自定义标签
   */
  addCustomTag() {
    const customTag = this.data.customTag.trim();
    if (!customTag) {
      wx.showToast({
        title: '请输入标签内容',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.tags_self.includes(customTag)) {
      wx.showToast({
        title: '标签已存在',
        icon: 'none'
      });
      return;
    }
    
    // 检查是否已在可用标签列表中
    if (!this.data.availableTags.includes(customTag)) {
      // 将新标签添加到可用标签列表
      const availableTags = [...this.data.availableTags, customTag];
      this.setData({
        availableTags: availableTags,
        processedTags: this.processTags(this.data.tags_self)
      });
    }
    
    // 新标签默认未选中，只添加到可用标签列表
    this.setData({
      customTag: ''
    });
    
    wx.showToast({
      title: '标签添加成功',
      icon: 'success'
    });
  },

  /**
   * 保存修改
   */
  saveChanges() {
    if (!this.data.nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    if (!this.data.userInfo) {
      wx.showToast({
        title: '用户信息不存在',
        icon: 'none'
      });
      return;
    }

    const db = wx.cloud.database();
    const userData = {
      nickname: this.data.nickname,
      avatarUrl: this.data.avatarUrl,
      bio: this.data.bio,
      gender: this.data.gender,
      mbti: this.data.mbti,
      tags_self: this.data.tags_self
    };

    db.collection('users').doc(this.data.userInfo._id).update({
      data: userData,
      success: (res) => {
        console.log('更新成功', res);
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        // 更新本地缓存中的用户信息（这样返回个人页时能立即看到更新）
        try {
          const cachedData = wx.getStorageSync('cachedUserInfo') || {};
          const prevUser = cachedData.userInfo || this.data.userInfo || {};
          const newUser = Object.assign({}, prevUser, userData);
          // 保证 _id 和 displayId 保留
          if (prevUser._id) newUser._id = prevUser._id;
          newUser.displayId = newUser._id || newUser.openid || '';
          wx.setStorageSync('cachedUserInfo', { userInfo: newUser, timestamp: Date.now() });
          // 提示 profile 页面刷新（返回时强制从后端重新拉取）
          wx.setStorageSync('profileUpdated', true);
          console.log('profile-edit: saved cache and set profileUpdated, newUser=', newUser);
          // 额外：尝试直接更新上一页的数据，使返回时能立刻看到更新（避免可见性延迟）
          try {
            const pages = getCurrentPages();
            if (pages && pages.length >= 2) {
              const prevPage = pages[pages.length - 2];
              // 更新前一页的字段（profile 页面期望的字段名），保持一致性
              prevPage.setData({
                userInfo: newUser,
                cachedUserInfo: newUser,
                isRegistered: true,
                isLoading: false
              });
              console.log('profile-edit: updated prevPage data directly');
            }
          } catch (e) {
            console.warn('profile-edit: update prevPage failed', e);
          }
        } catch (e) {
          console.warn('更新缓存失败', e);
        }

        // 跳转到个人中心
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      fail: (err) => {
        console.error('更新失败', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  tipAvatar() {
    wx.showToast({ title: '请在个人中心主页点击头像更换', icon: 'none' });
  },
})