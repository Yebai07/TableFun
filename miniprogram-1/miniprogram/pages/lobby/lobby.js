const db = wx.cloud.database()

Page({
  data: {
    allTeamups: [], 
    teamupList: [], 
    isLoading: true,

    searchKeyword: '',
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

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.processData();
  },

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

  processData() {
    let list = [...this.data.allTeamups]; 

    // 1. 模糊搜索
    if (this.data.searchKeyword.trim() !== '') {
      const keyword = this.data.searchKeyword.trim();
      list = list.filter(item => 
        item.scriptTitle && item.scriptTitle.includes(keyword)
      );
    }

    // 2. 类型筛选
    if (this.data.currentType !== '全部') {
      list = list.filter(item => 
        item.scriptType && item.scriptType.includes(this.data.currentType)
      );
    }

    // 3. 时间排序
    list.sort((a, b) => {
      let timeA = new Date(a.startTime.replace(/-/g, '/')).getTime() || 0;
      let timeB = new Date(b.startTime.replace(/-/g, '/')).getTime() || 0;
      return this.data.timeSortAsc ? (timeA - timeB) : (timeB - timeA);
    });

    // 4. 计算是否已锁定 & 文案无痕替换
    const now = new Date().getTime(); // 获取用户当前的现实时间戳

    list = list.map(item => {
      let isLocked = false;
      let startTimestamp = new Date(item.startTime.replace(/-/g, '/')).getTime();

      if (item.lockRule) {
        if (item.lockRule.includes('不限')) {
          isLocked = false;
        } else if (item.lockRule.includes('即锁')) {
          // 如果是“开始即锁”，比较当前时间是否大于等于发车时间
          isLocked = now >= startTimestamp;
        } else {
          // 用正则提取出“前12小时”里的数字 12
          const match = item.lockRule.match(/前(\d+)小时/);
          if (match && match[1]) {
            const hours = parseInt(match[1], 10);
            // 计算出锁车的具体时间戳 (发车时间 - 规定小时数的毫秒值)
            const lockTimestamp = startTimestamp - (hours * 60 * 60 * 1000);
            // 如果当前时间已经超过了锁车时间，则标记为已锁定
            isLocked = now >= lockTimestamp;
          }
        }
      }

      return {
        ...item,
        displayLockRule: item.lockRule ? item.lockRule.replace(/发车/g, '开始') : '',
        isLocked: isLocked // 将计算结果新增为一个字段，供 wxml 使用
      };
    });

    this.setData({ teamupList: list, isLoading: false });
  },

  viewTeamup(e) {
    const teamupId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/teamup-detail/teamup-detail?id=${teamupId}`
    });
  }
})