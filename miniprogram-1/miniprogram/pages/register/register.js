// pages/register/register.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    avatarUrl: '/images/default-avatar.png',
    bio: '这是我的个性签名...',
    gender: 1,
    mbti: 'ENTP',
    age: '',
    region: '',
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
    this.setData({
      processedTags: this.processTags([])
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
   * 输入年龄
   */
  inputAge(e) {
    this.setData({
      age: e.detail.value
    });
  },

  /**
   * 输入地区
   */
  inputRegion(e) {
    this.setData({
      region: e.detail.value
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
    
    // 添加到已选标签
    const tags_self = [...this.data.tags_self, customTag];
    this.setData({
      tags_self: tags_self,
      processedTags: this.processTags(tags_self),
      customTag: ''
    });
    
    wx.showToast({
      title: '标签添加成功',
      icon: 'success'
    });
  },

  /**
   * 选择标签
   */
  selectTag(e) {
    console.log('点击标签:', e);
    const tag = e.currentTarget.dataset.tag;
    console.log('选择标签:', tag);
    let tags_self = [...this.data.tags_self];
    console.log('选择前标签:', tags_self);
    if (tags_self.includes(tag)) {
      tags_self = tags_self.filter(item => item !== tag);
    } else {
      tags_self.push(tag);
    }
    console.log('选择后标签:', tags_self);
    this.setData({
      tags_self: tags_self,
      processedTags: this.processTags(tags_self)
    });
    console.log('setData后标签:', this.data.tags_self);
    console.log('处理后的标签:', this.data.processedTags);
  },

  /**
   * 注册
   */
  register() {
    if (!this.data.nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 获取用户的openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        if (res.result && res.result.openid) {
          const openid = res.result.openid;
          this.createUser(openid);
        } else {
          console.error('获取openid失败，返回结果异常', res);
          // 使用模拟openid进行测试
          const mockOpenid = 'mock_openid_' + Date.now();
          console.log('使用模拟openid:', mockOpenid);
          this.createUser(mockOpenid);
        }
      },
      fail: (err) => {
        console.error('获取openid失败', err);
        // 使用模拟openid进行测试
        const mockOpenid = 'mock_openid_' + Date.now();
        console.log('使用模拟openid:', mockOpenid);
        this.createUser(mockOpenid);
      }
    });
  },

  /**
   * 创建用户数据
   */
  createUser(openid) {
    const db = wx.cloud.database();
    const userData = {
      avatarUrl: this.data.avatarUrl,
      bio: this.data.bio,
      creditScore: 800, // 默认信用分
      gender: this.data.gender,
      mbti: this.data.mbti,
      nickname: this.data.nickname,
      age: this.data.age,
      region: this.data.region,
      tags_others: [], // 默认空
      tags_self: this.data.tags_self // 用户选择的标签
    };

    db.collection('users').add({
      data: userData,
      success: (res) => {
        console.log('注册成功', res);
        // 构造完整的用户信息对象
        const completeUserInfo = {
          ...userData,
          _id: res._id,
          _openid: openid
        };
        // 缓存用户信息和设置登录状态，添加时间戳
        const cachedData = {
          userInfo: completeUserInfo,
          timestamp: Date.now()
        };
        wx.setStorageSync('cachedUserInfo', cachedData);
        wx.setStorageSync('loginStatus', true);
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        });
        // 跳转到个人中心
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/profile/profile'
          });
        }, 1500);
      },
      fail: (err) => {
        console.error('注册失败', err);
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        });
      }
    });
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

  }
})