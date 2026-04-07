// pages/rate-user/rate-user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [
      "剧本杀大神", "社交达人", "细节控", "气氛烘托者",
      "反串爱好者", "新手护航者", "复盘小能手", "人形测谎仪"
    ],
    processedTags: [],
    customTag: '',
    selectedTags: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initTags();
  },

  /**
   * 初始化标签
   */
  initTags() {
    const tags = this.data.tags;
    const processedTags = tags.map(tag => ({
      name: tag,
      selected: false
    }));
    this.setData({
      processedTags: processedTags
    });
  },

  /**
   * 切换标签选择状态
   */
  toggleTag(e) {
    const index = e.currentTarget.dataset.index;
    const processedTags = [...this.data.processedTags];
    processedTags[index].selected = !processedTags[index].selected;
    this.setData({
      processedTags: processedTags
    });
  },

  /**
   * 自定义标签输入
   */
  onCustomTagInput(e) {
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

    // 检查标签是否已存在
    const existingTags = this.data.processedTags.map(tag => tag.name);
    if (existingTags.includes(customTag)) {
      wx.showToast({
        title: '标签已存在',
        icon: 'none'
      });
      return;
    }

    // 添加新标签
    const processedTags = [...this.data.processedTags, {
      name: customTag,
      selected: false
    }];

    this.setData({
      processedTags: processedTags,
      customTag: ''
    });
  },

  /**
   * 提交评价
   */
  submitEvaluation() {
    // 获取选中的标签
    const selectedTags = this.data.processedTags
      .filter(tag => tag.selected)
      .map(tag => tag.name);

    if (selectedTags.length === 0) {
      wx.showToast({
        title: '请至少选择一个标签',
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
          this.updateUserTags(openid, selectedTags);
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
   * 更新用户标签
   */
  updateUserTags(openid, selectedTags) {
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid: openid
    }).get({
      success: (res) => {
        if (res.data && res.data.length > 0) {
          const user = res.data[0];
          const tags_others = user.tags_others || [];
          
          // 处理标签计数
          selectedTags.forEach(tagName => {
            const existingTag = tags_others.find(tag => tag.name === tagName);
            if (existingTag) {
              existingTag.count += 1;
            } else {
              tags_others.push({ name: tagName, count: 1 });
            }
          });

          // 更新数据库
          db.collection('users').doc(user._id).update({
            data: {
              tags_others: tags_others
            },
            success: (res) => {
              console.log('评价成功', res);
              wx.showToast({
                title: '评价成功',
                icon: 'success'
              });
              
              // 显示操作选项
              setTimeout(() => {
                wx.showModal({
                  title: '评价成功',
                  content: '是否返回上一页？',
                  confirmText: '返回',
                  cancelText: '再次评价',
                  success: (res) => {
                    if (res.confirm) {
                      wx.navigateBack();
                    } else if (res.cancel) {
                      // 重置标签选择
                      this.initTags();
                    }
                  }
                });
              }, 1000);
            },
            fail: (err) => {
              console.error('更新标签失败', err);
              wx.showToast({
                title: '评价失败，请重试',
                icon: 'none'
              });
            }
          });
        } else {
          console.error('用户信息不存在');
          wx.showToast({
            title: '用户信息不存在',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败',
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
  }
})
