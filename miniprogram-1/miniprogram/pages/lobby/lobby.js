const db = wx.cloud.database();
const { calcLockStatusList } = require('../../utils');

Page({
  data: {
    inReview: true,
    fakeMemos: [
      { id: 1, title: '去超市买牛奶和鸡蛋', time: '今天 18:00', type: '生活' },
      { id: 2, title: '晚上 8 点和老王有个线上会议', time: '今天 20:00', type: '工作' },
      { id: 3, title: '周末去修理厂保养车子', time: '本周六', type: '日程' }
    ],
    timer: null,
    typeOptions: ['全部', '情感', '硬核', '欢乐', '阵营', '惊悚', '机制'],
    currentType: '全部类型',
    searchKeyword: '',
    timeSortAsc: false,
    teamupList: [],
    isLoading: false
  },

  onShow() {
    this.checkReviewStatus();
    this.fetchTeamupList();
  },

  onHide() {
    if (this.data.timer) clearInterval(this.data.timer);
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer);
  },
  checkReviewStatus() {
    this.setData({ isLoading: true });
    
    db.collection('app_config').doc('review_switch').get({
      success: (res) => {
        const isReviewing = res.data.inReview;
        
        wx.setStorageSync('GLOBAL_IN_REVIEW', isReviewing);

        this.setData({ 
          inReview: isReviewing,
          isLoading: false
        });

        if (!isReviewing) {
          this.fetchTeamupList();
        }
      },
      fail: (err) => {
        // 断网或报错时，强制设为 true，安全第一
        wx.setStorageSync('GLOBAL_IN_REVIEW', true);
        this.setData({ inReview: true, isLoading: false });
      }
    });
  },

  fetchTeamupList() {
    this.setData({ isLoading: true });

    // 明确限制 100 条，避免免费版默认 20 条静默截断
    db.collection('teamups')
      .orderBy('createTime', 'desc')
      .limit(100)
      .get()
      .then(res => {
        const now = Date.now();
        const keyword = (this.data.searchKeyword || '').trim().toLowerCase();

        const filtered = res.data.filter(item => {
          const startTimestamp = new Date(item.startTime.replace(/-/g, '/')).getTime();
          const isExpired = now >= startTimestamp && item.currentPlayers < item.targetPlayers;
          if (isExpired) return false;

          // 2. 类型筛选
          const typeMatch = this.data.currentType === '全部类型' || item.scriptType === this.data.currentType;
          if (!typeMatch) return false;

          // 3. 关键词搜索
          if (keyword) {
            const title = (item.scriptTitle || '').toLowerCase();
            if (!title.includes(keyword)) return false;
          }

          return true;
        });

        // 时间排序
        filtered.sort((a, b) => {
          const tA = new Date(a.startTime.replace(/-/g, '/')).getTime();
          const tB = new Date(b.startTime.replace(/-/g, '/')).getTime();
          return this.data.timeSortAsc ? tA - tB : tB - tA;
        });

        const list = calcLockStatusList(filtered);
        this.setData({ teamupList: list, isLoading: false });

        // 每分钟刷新一次倒计时文字
        if (this.data.timer) clearInterval(this.data.timer);
        const timer = setInterval(() => {
          const refreshed = calcLockStatusList([...this.data.teamupList]);
          this.setData({ teamupList: refreshed });
        }, 60000);
        this.setData({ timer });
      })
      .catch(err => {
        console.error('获取列表失败', err);
        this.setData({ isLoading: false });
        wx.showToast({ title: '加载失败，请重试', icon: 'none' });
      });
  },

  onTypeChange(e) {
    const selected = this.data.typeOptions[e.detail.value];
    this.setData({ currentType: selected === '全部' ? '全部类型' : selected });
    this.fetchTeamupList();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.fetchTeamupList();
  },

  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.fetchTeamupList();
  },

  toggleTimeSort() {
    this.setData({ timeSortAsc: !this.data.timeSortAsc });
    this.fetchTeamupList();
  },

  viewTeamup(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/pages/teamup-detail/teamup-detail?id=${id}` });
  }
});
