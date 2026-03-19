// pages/discover/discover.js
const app = getApp();

Page({
  data: {
    currentCity: '北京',
    currentTab: 'hot',
    tabs: [
      { key: 'hot', label: '热门' },
      { key: 'new', label: '最新' },
      { key: 'nearby', label: '附近' }
    ],
    hotActivities: [
      {
        id: 1,
        title: '周末恐怖本拼车',
        scriptName: '午夜惊魂',
        scriptCover: '/images/script-cover-1.png',
        organizer: '桌友小王',
        avatar: '/images/default-avatar.png',
        playerCount: 6,
        currentPlayers: 4,
        date: '本周六 14:00',
        location: '北京市朝阳区',
        tags: ['恐怖', '新手友好'],
        status: 'recruiting'
      },
      {
        id: 2,
        title: '古风本情感局',
        scriptName: '宫廷秘史',
        scriptCover: '/images/script-cover-3.png',
        organizer: '古风爱好者',
        avatar: '/images/default-avatar.png',
        playerCount: 7,
        currentPlayers: 5,
        date: '本周日 19:00',
        location: '北京市海淀区',
        tags: ['古风', '情感'],
        status: 'recruiting'
      },
      {
        id: 3,
        title: '硬核推理挑战',
        scriptName: '迷雾侦探',
        scriptCover: '/images/script-cover-2.png',
        organizer: '推理达人',
        avatar: '/images/default-avatar.png',
        playerCount: 5,
        currentPlayers: 2,
        date: '下周五 20:00',
        location: '北京市西城区',
        tags: ['推理', '硬核'],
        status: 'recruiting'
      }
    ],
    newActivities: [
      {
        id: 4,
        title: '新人体验局',
        scriptName: '欢乐一家亲',
        scriptCover: '/images/script-cover-8.png',
        organizer: 'DM小李',
        avatar: '/images/default-avatar.png',
        playerCount: 8,
        currentPlayers: 6,
        date: '今天 15:00',
        location: '北京市东城区',
        tags: ['欢乐', '新手'],
        status: 'urgent'
      }
    ],
    nearbyActivities: []
  },

  onLoad() {
    this.loadCurrentCity();
    this.loadNearbyActivities();
  },

  // 加载当前城市
  loadCurrentCity() {
    const currentCity = app.globalData.currentCity || '北京';
    this.setData({ currentCity });
  },

  // 显示城市选择器
  showCitySelector() {
    wx.showToast({
      title: '选择城市',
      icon: 'none'
    });
    // 可以在这里调用全局的城市选择器或跳转到城市选择页面
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  // 加载附近活动
  loadNearbyActivities() {
    // 模拟获取附近活动
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 实际项目中应该根据位置获取附近的活动
        this.setData({
          nearbyActivities: this.data.hotActivities.slice(0, 2)
        });
      },
      fail: () => {
        this.setData({
          nearbyActivities: this.data.hotActivities.slice(0, 2)
        });
      }
    });
  },

  // 查看活动详情
  viewActivityDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '活动详情功能开发中',
      icon: 'none'
    });
  },

  // 立即加入
  joinActivity(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '加入成功',
      icon: 'success'
    });
  },

  // 联系发起人
  contactOrganizer(e) {
    wx.showToast({
      title: '联系功能开发中',
      icon: 'none'
    });
  }
})
