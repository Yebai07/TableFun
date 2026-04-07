const db = wx.cloud.database()

Page({
  data: {
    currentTab: 0, // 0: 我发起的, 1: 我加入的
    createdList: [],
    joinedList: [],
    isLoading: true
  },

  onShow() {
    this.fetchMyTeamups()
  },

  onPullDownRefresh() {
    this.fetchMyTeamups().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 切换 Tab
   */
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
  },

  /**
   * 拉取我的行程
   */
  fetchMyTeamups() {
    return new Promise((resolve, reject) => {
      const cachedData = wx.getStorageSync('cachedUserInfo');
      if (!cachedData || !cachedData.userInfo) {
        this.setData({ isLoading: false });
        return resolve();
      }
      
      const myOpenid = cachedData.userInfo._openid || cachedData.userInfo.openid;
      this.setData({ isLoading: true });

      // 查询所有 joinedPlayers 中包含我的 openid 的局
      db.collection('teamups').where({
        'joinedPlayers.openid': myOpenid
      }).orderBy('createTime', 'desc').get()
      .then(res => {
        const allTeamups = res.data;
        const created = [];
        const joined = [];
        const now = new Date().getTime();

        allTeamups.forEach(item => {
          // 1. 判断是否已发车（过去式）- 增加安全校验防止报错
          let startTimestamp = 0;
          // 确保 startTime 存在且是字符串，再执行 replace
          if (item.startTime && typeof item.startTime === 'string') {
            startTimestamp = new Date(item.startTime.replace(/-/g, '/')).getTime() || 0;
          }
          
          // 如果拿不到有效时间，默认算作未过期 (false)
          item.isPast = startTimestamp > 0 ? (now >= startTimestamp) : false;

          // 2. 判断我是发起人还是加入者
          const myRecord = (item.joinedPlayers || []).find(p => p.openid === myOpenid);
          if (myRecord && myRecord.isCreator) {
            created.push(item);
          } else {
            joined.push(item);
          }
        });

        this.setData({
          createdList: created,
          joinedList: joined,
          isLoading: false
        });
        resolve();
      })
      .catch(err => {
        console.error("获取行程失败", err);
        this.setData({ isLoading: false });
        reject();
      })
    })
  },

  /**
   * 点击卡片进入拼车详情
   */
  goToDetail(e) {
    const teamupId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/teamup-detail/teamup-detail?id=${teamupId}`
    });
  }
})