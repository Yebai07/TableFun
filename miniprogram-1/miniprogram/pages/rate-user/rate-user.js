Page({
  data: {
    targetOpenid: '',
    customTag: '',
    // 精心挑选的高频剧本杀预设标签
    presetTags: [
      { name: '逻辑鬼才', selected: false },
      { name: '戏精本精', selected: false },
      { name: '带飞全场', selected: false },
      { name: '情感水龙头', selected: false },
      { name: '人形测谎仪', selected: false },
      { name: '气氛担当', selected: false },
      { name: '新手之友', selected: false },
      { name: '铁坦玩家', selected: false }
    ]
  },

  onLoad(options) {
    if (options.openid) {
      this.setData({ targetOpenid: options.openid });
    } else {
      wx.showToast({ title: '迷路了：未找到评价对象', icon: 'none' });
    }
  },

  // 切换标签选中状态
  toggleTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.presetTags;
    tags[index].selected = !tags[index].selected;
    this.setData({ presetTags: tags });
  },

  // 监听输入框
  onCustomInput(e) {
    this.setData({ customTag: e.detail.value });
  },

  // 添加自定义标签到列表（并默认选中）
  addCustomTag() {
    const val = this.data.customTag.trim();
    if (!val) return;
    
    const tags = this.data.presetTags;
    // 判重
    if (tags.some(t => t.name === val)) {
      return wx.showToast({ title: '该标签已存在', icon: 'none' });
    }
    
    // 把新标签插到数组最前面，并默认高亮
    tags.unshift({ name: val, selected: true });
    this.setData({ 
      presetTags: tags, 
      customTag: '' // 清空输入框
    });
  },

  // 提交评价
  submitRate() {
    if (!this.data.targetOpenid) {
      return wx.showToast({ title: '缺少评价对象', icon: 'none' });
    }

    // 提取所有被选中的标签名字
    const selectedNames = this.data.presetTags
      .filter(t => t.selected)
      .map(t => t.name);

    if (selectedNames.length === 0) {
      return wx.showToast({ title: '请至少选择一个标签', icon: 'none' });
    }

    // 前端防线：不能评价自己
    const myInfo = wx.getStorageSync('cachedUserInfo')?.userInfo;
    const myOpenid = myInfo?._openid || myInfo?.openid;
    if (myOpenid === this.data.targetOpenid) {
      return wx.showToast({ title: '不能给自己贴标签哦', icon: 'none' });
    }

    wx.showLoading({ title: '正在盖章...', mask: true });

    wx.cloud.callFunction({
      name: 'updateUserTags', // 必须和你刚创建的云函数名字一模一样
      data: {
        targetOpenid: this.data.targetOpenid,
        tags: selectedNames
      },
      success: (res) => {
        wx.hideLoading();
        if (res.result && res.result.success) {
          wx.showToast({ title: '评价成功！', icon: 'success' });
          // 延迟 1.5 秒后自动返回上一页
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: res.result?.msg || '操作失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error(err);
        wx.showToast({ title: '网络不太畅通', icon: 'none' });
      }
    });
  }
})