const db = wx.cloud.database()

Page({
  data: {
    allTeamups: [], 
    teamupList: [], 
    isLoading: true,

    searchKeyword: '', // 新增：搜索关键词
    typeOptions: ['全部', '情感', '推理', '欢乐', '机制', '惊悚'],
    currentType: '全部',
    timeSortAsc: true 
  },

  onShow() {
    this.fetchTeamups()
  },

  onPullDownRefresh() {
    this.fetchTeamups().then(() => { wx.stopPullDownRefresh() })
  },

  fetchTeamups() {
    return new Promise((resolve, reject) => {
      this.setData({ isLoading: true })
      db.collection('teamups').where({ status: 'recruiting' }).orderBy('createTime', 'desc').get()
        .then(res => {
          this.setData({ allTeamups: res.data })
          this.processData() 
          resolve()
        })
        .catch(err => {
          console.error('获取拼车列表失败', err)
          this.setData({ isLoading: false })
          reject(err)
        })
    })
  },

  // ===== 新增：搜索框输入事件 =====
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.processData(); // 每次输入一个字，都会瞬间过滤
  },

  // ===== 新增：清空搜索框 =====
  clearSearch() {
    this.setData({ searchKeyword: '' });
    this.processData();
  },

  onTypeChange(e) {
    const selectedType = this.data.typeOptions[e.detail.value];
    this.setData({ currentType: selectedType });
    this.processData(); 
  },

  toggleTimeSort() {
    this.setData({ timeSortAsc: !this.data.timeSortAsc });
    this.processData(); 
  },

  /**
   * 核心处理器升级：包含 搜索 + 筛选 + 排序 的三重过滤
   */
  processData() {
    let list = [...this.data.allTeamups]; 

    // 1. 剧本名称模糊搜索 (新增逻辑)
    if (this.data.searchKeyword.trim() !== '') {
      const keyword = this.data.searchKeyword.trim();
      list = list.filter(item => 
        item.scriptTitle && item.scriptTitle.includes(keyword)
      );
    }

    // 2. 剧本类型筛选
    if (this.data.currentType !== '全部') {
      list = list.filter(item => 
        item.scriptType && item.scriptType.includes(this.data.currentType)
      );
    }

    // 3. 发车时间排序
    list.sort((a, b) => {
      let timeA = new Date(a.startTime.replace(/-/g, '/')).getTime() || 0;
      let timeB = new Date(b.startTime.replace(/-/g, '/')).getTime() || 0;
      return this.data.timeSortAsc ? (timeA - timeB) : (timeB - timeA);
    });

    this.setData({ teamupList: list, isLoading: false });
  },

  viewTeamup(e) {
    const teamupId = e.currentTarget.dataset.id;
    wx.showToast({ title: '拼车详情页还在开发中...', icon: 'none' })
  }
})