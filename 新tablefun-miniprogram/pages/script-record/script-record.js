// pages/script-record/script-record.js
const app = getApp();

Page({
  data: {
    records: [],
    filteredRecords: [],
    searchKeyword: '',
    statusBarHeight: 0,
    navBarHeight: 0
  },

  onLoad() {
    this.getSystemInfo();
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    // 计算导航栏高度
    const navBarHeight = menuButtonInfo.top + menuButtonInfo.height - statusBarHeight + 10;

    this.setData({
      statusBarHeight,
      navBarHeight
    });
  },

  // 加载剧本记录
  loadRecords() {
    const records = wx.getStorageSync('scriptRecords') || [];
    this.setData({
      records,
      filteredRecords: records
    });
  },

  // 查看记录详情
  viewRecordDetail(e) {
    const recordId = e.currentTarget.dataset.id;
    const scriptIdFromData = e.currentTarget.dataset.scriptId;
    const record = this.data.filteredRecords.find(r => r.id === recordId);

    console.log('点击记录，scriptId:', scriptIdFromData);
    console.log('记录数据:', record);

    if (record) {
      // 使用scriptId，如果没有则无法跳转
      if (record.scriptId) {
        wx.navigateTo({
          url: `/pages/script-detail/script-detail?id=${record.scriptId}`
        });
      } else {
        wx.showToast({
          title: '此剧本记录无法跳转（旧数据）',
          icon: 'none'
        });
      }
    } else {
      wx.showToast({
        title: '记录不存在',
        icon: 'none'
      });
    }
  },

  // 返回
  goBack() {
    wx.navigateBack();
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });
    this.filterRecords(keyword);
  },

  // 搜索确认
  onSearch() {
    this.filterRecords(this.data.searchKeyword);
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchKeyword: '',
      filteredRecords: this.data.records
    });
  },

  // 过滤记录
  filterRecords(keyword) {
    if (!keyword) {
      this.setData({ filteredRecords: this.data.records });
      return;
    }

    const filtered = this.data.records.filter(record =>
      record.name.toLowerCase().includes(keyword.toLowerCase())
    );
    this.setData({ filteredRecords: filtered });
  }
})
