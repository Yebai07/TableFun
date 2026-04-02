const db = wx.cloud.database()

Page({
  data: {
    timer: null,
    // --- 补回筛选相关数据 ---
    typeOptions: ['全部', '情感', '硬核', '欢乐', '阵营', '惊悚', '机制'],
    currentType: '全部类型'
  },

  onShow() {
    this.fetchTeamupList()
  },

  onHide() {
    // 页面不可见时销毁定时器，节省性能
    if (this.data.timer) clearInterval(this.data.timer)
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer)
  },

  fetchTeamupList() {
    db.collection('teamups').orderBy('createTime', 'desc').get().then(res => {
      const now = new Date().getTime();
      
      const filteredList = res.data.filter(item => {
        // 1. 时间过滤逻辑 (防止流局僵尸车)
        const startTimeStr = item.startTime.replace(/-/g, '/');
        const startTimestamp = new Date(startTimeStr).getTime();
        const isExpired = (now >= startTimestamp) && (item.currentPlayers < item.targetPlayers);
        
        // 2. 类型过滤逻辑
        const typeMatch = this.data.currentType === '全部类型' || item.scriptType === this.data.currentType;

        return !isExpired && typeMatch; // 只有没过期且类型匹配的才显示
      });

      // 计算锁车状态（复用之前的函数）
      const list = this.calculateAllLockStatus(filteredList);
      
      this.setData({ teamupList: list });
      // ... 定时器逻辑保持不变 ...
    })
  },
  /**
   * 切换剧本类型筛选
   */
  onTypeChange(e) {
    const index = e.detail.value;
    const selectedType = this.data.typeOptions[index];
    
    this.setData({
      currentType: selectedType === '全部' ? '全部类型' : selectedType
    });

    // 重新拉取并筛选列表
    this.fetchTeamupList();
  },

  /**
   * 批量计算锁车文本的工具函数
   */
  calculateAllLockStatus(list) {
    const now = new Date().getTime();
    return list.map(item => {
      const startTimeStr = item.startTime.replace(/-/g, '/');
      const startTimestamp = new Date(startTimeStr).getTime();
      
      // 1. 优先判定：人满即锁
      const isFull = item.currentPlayers >= item.targetPlayers;
      if (item.lockWhenFull && isFull) {
        item.isLocked = true;
        item.lockStatusText = "已满员锁车";
        return item;
      }

      // 2. 判定：时间锁车
      // 兼容老数据（如果没有lockHours，默认当做0）
      const hours = item.lockHours || 0; 
      let deadline = startTimestamp - (hours * 60 * 60 * 1000);

      const diff = deadline - now;
      if (hours === 0 && diff > 0) {
        // 选了不锁定，且还没发车
        item.isLocked = false;
        item.lockStatusText = "招募中";
      } else if (diff <= 0) {
        // 过期了
        item.lockStatusText = "已锁车";
        item.isLocked = true;
      } else {
        // 倒计时计算
        item.isLocked = false;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (h > 24) {
          item.lockStatusText = `距锁定还有${Math.floor(h/24)}天`;
        } else if (h > 0) {
          item.lockStatusText = `距锁定还有${h}小时${m}分`;
        } else {
          item.lockStatusText = `距锁定还有${m}分`;
        }
      }
      return item;
    });
  },
  /**
   * 跳转到拼车详情页
   */
  viewTeamup(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    
    wx.navigateTo({
      url: `/pages/teamup-detail/teamup-detail?id=${id}`
    });
  },
})