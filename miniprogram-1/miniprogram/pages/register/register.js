// pages/register/register.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    avatarUrl: '/images/default-avatar.png',
    bio: '这个人很懒，什么也没留下……',
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
   * 注册按钮点击事件
   */
  register() {
    if (!this.data.nickname) {
      return wx.showToast({ title: '请输入昵称', icon: 'none' });
    }
    // 不再调用云函数，直接进入创建流程
    this.createUser(); 
  },

  /**
   * 创建或更新用户数据（自带防重复机制）
   */
  createUser() {
    const db = wx.cloud.database();
    const userData = {
      avatarUrl: this.data.avatarUrl,
      bio: this.data.bio,
      creditScore: 800,
      gender: this.data.gender,
      mbti: this.data.mbti,
      nickname: this.data.nickname,
      age: this.data.age,
      region: this.data.region,
      tags_others: [],
      tags_self: this.data.tags_self
    };

    wx.showLoading({ title: '正在处理...' });

    // 1. 先用魔术变量查一查，你是不是已经注册过了
    db.collection('users').where({ _openid: '{openid}' }).get().then(res => {
      if (res.data.length > 0) {
        // 【情况A】老用户：覆盖更新资料
        const existDocId = res.data[0]._id;
        const realOpenid = res.data[0]._openid; // 拿到真实的微信ID
        db.collection('users').doc(existDocId).update({ data: userData }).then(() => {
          this.saveAndLogin(userData, existDocId, realOpenid);
        });
      } else {
        // 【情况B】纯新用户：新增记录
        db.collection('users').add({ data: userData }).then(addRes => {
          // 新增成功后，立刻查回这条数据，获取微信系统为你自动生成的真实 OpenID
          db.collection('users').doc(addRes._id).get().then(docRes => {
            this.saveAndLogin(userData, addRes._id, docRes.data._openid);
          });
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('数据库操作失败', err);
      wx.showToast({ title: '注册失败', icon: 'none' });
    });
  },

  /**
   * 提取出来的公共方法：保存缓存并跳转（无需修改，直接保留之前的即可）
   */
  saveAndLogin(userData, docId, openid) {
    wx.hideLoading();
    const completeUserInfo = { ...userData, _id: docId, _openid: openid };
    wx.setStorageSync('cachedUserInfo', { userInfo: completeUserInfo, timestamp: Date.now() });
    wx.setStorageSync('loginStatus', true);
    wx.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => { wx.switchTab({ url: '/pages/profile/profile' }); }, 1500);
  },

  /**
   * 提取出来的公共方法：保存缓存并跳转
   */
  saveAndLogin(userData, docId, openid) {
    wx.hideLoading();
    // 构造完整的用户信息对象
    const completeUserInfo = {
      ...userData,
      _id: docId,
      _openid: openid
    };
    
    // 更新本地缓存
    wx.setStorageSync('cachedUserInfo', {
      userInfo: completeUserInfo,
      timestamp: Date.now()
    });
    wx.setStorageSync('loginStatus', true);
    
    wx.showToast({ title: '注册成功', icon: 'success' });
    
    // 跳转到个人中心
    setTimeout(() => {
      wx.switchTab({ url: '/pages/profile/profile' });
    }, 1500);
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