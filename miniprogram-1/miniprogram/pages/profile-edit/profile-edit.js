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
    // 获取用户的openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        const openid = res.result.openid;
        this.getUserData(openid);
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
          this.setData({
            userInfo: userInfo,
            nickname: userInfo.nickname || '',
            avatarUrl: userInfo.avatarUrl || '/images/default-avatar.png',
            bio: userInfo.bio || '',
            gender: userInfo.gender || 1,
            mbti: userInfo.mbti || '',
            tags_self: userInfo.tags_self || []
          });
        }
      },
      fail: (err) => {
        console.error('获取用户数据失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
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
      tags_self: tags_self
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
        availableTags: availableTags
      });
    }
    
    // 添加到已选标签
    const tags_self = [...this.data.tags_self, customTag];
    this.setData({
      tags_self: tags_self,
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

  }
})