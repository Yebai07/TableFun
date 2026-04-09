// pages/register/register.js
Page({
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
    ],
    // 🚀 新增：头像选择库状态
    showAvatarPopup: false,
    avatarList: [
      '/images/default-avatar.png',
      '/images/avatar-1.png',
      '/images/avatar-2.png',
      '/images/avatar-3.png',
      '/images/avatar-4.png',
      '/images/avatar-5.png',
      '/images/avatar-6.png'
    ]
  },

  onLoad() {
    this.setData({ processedTags: this.processTags([]) });
  },

  processTags(selectedTags) {
    return this.data.availableTags.map(tag => ({
      name: tag,
      selected: selectedTags.includes(tag)
    }));
  },

  // 输入绑定
  inputNickname(e) { this.setData({ nickname: e.detail.value }); },
  inputBio(e) { this.setData({ bio: e.detail.value }); },
  chooseGender(e) { this.setData({ gender: parseInt(e.detail.value) }); },
  inputMbti(e) { this.setData({ mbti: e.detail.value }); },
  inputAge(e) { this.setData({ age: e.detail.value }); },
  inputRegion(e) { this.setData({ region: e.detail.value }); },
  inputCustomTag(e) { this.setData({ customTag: e.detail.value }); },

  // 🚀 新增：打开/关闭/选择头像
  chooseAvatar() { this.setData({ showAvatarPopup: true }); },
  closeAvatarPopup() { this.setData({ showAvatarPopup: false }); },
  selectAvatar(e) {
    this.setData({ 
      avatarUrl: e.currentTarget.dataset.url,
      showAvatarPopup: false
    });
  },

  // 标签逻辑
  selectTag(e) {
    const tag = e.currentTarget.dataset.tag;
    let tags_self = [...this.data.tags_self];
    if (tags_self.includes(tag)) {
      tags_self = tags_self.filter(t => t !== tag);
    } else {
      tags_self.push(tag);
    }
    this.setData({ tags_self, processedTags: this.processTags(tags_self) });
  },

  addCustomTag() {
    const customTag = this.data.customTag.trim();
    if (!customTag) return wx.showToast({ title: '请输入标签内容', icon: 'none' });
    if (this.data.tags_self.includes(customTag)) return wx.showToast({ title: '标签已存在', icon: 'none' });

    let availableTags = this.data.availableTags;
    if (!availableTags.includes(customTag)) {
      availableTags = [...availableTags, customTag];
    }
    const tags_self = [...this.data.tags_self, customTag];
    this.setData({
      availableTags,
      tags_self,
      processedTags: this.processTags(tags_self),
      customTag: ''
    });
    wx.showToast({ title: '标签添加成功', icon: 'success' });
  },

  // 注册逻辑
  register() {
    if (!this.data.nickname) return wx.showToast({ title: '请输入昵称', icon: 'none' });
    this.createUser();
  },

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

    wx.showLoading({ title: '正在创建档案...', mask: true });

    db.collection('users').where({ _openid: '{openid}' }).get().then(res => {
      if (res.data.length > 0) {
        const existDocId = res.data[0]._id;
        const realOpenid = res.data[0]._openid;
        return db.collection('users').doc(existDocId).update({ data: userData }).then(() => {
          this.saveAndLogin(userData, existDocId, realOpenid);
        });
      } else {
        return db.collection('users').add({ data: userData }).then(addRes => {
          return db.collection('users').doc(addRes._id).get().then(docRes => {
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

  saveAndLogin(userData, docId, openid) {
    wx.hideLoading();
    const completeUserInfo = { ...userData, _id: docId, _openid: openid };
    wx.setStorageSync('cachedUserInfo', { userInfo: completeUserInfo, timestamp: Date.now() });
    wx.setStorageSync('loginStatus', true);
    wx.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => { wx.switchTab({ url: '/pages/profile/profile' }); }, 1500);
  }
});