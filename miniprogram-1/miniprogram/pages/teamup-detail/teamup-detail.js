const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    teamupId: '',
    teamup: {},
    isLoading: true,
    
    emptySlots: [], // 算出来还有几个空位
    hasJoined: false, // 当前用户是否已在车上
    isLocked: false, // 车是否已锁
    isFull: false, // 车是否已满
    
    currentUser: null // 当前登录用户信息
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ teamupId: options.id });
      // 拿到队友在个人中心存的缓存数据！
      const cachedData = wx.getStorageSync('cachedUserInfo');
      if (cachedData && cachedData.userInfo) {
        this.setData({ currentUser: cachedData.userInfo });
      }
      this.fetchTeamupDetail();
    }
  },

  fetchTeamupDetail() {
    db.collection('teamups').doc(this.data.teamupId).get().then(res => {
      const data = res.data;
      
      // 1. 判断自己是否在车上
      let hasJoined = false;
      if (this.data.currentUser) {
        hasJoined = data.joinedPlayers.some(p => p.openid === this.data.currentUser._openid);
      }

      // 2. 判断是否满车
      const isFull = data.currentPlayers >= data.targetPlayers;

      // 3. 判断是否锁车 (复用我们之前的计算逻辑)
      let isLocked = false;
      const now = new Date().getTime();
      const startTimestamp = new Date(data.startTime.replace(/-/g, '/')).getTime();
      if (data.lockRule && data.lockRule.includes('即锁')) {
        isLocked = now >= startTimestamp;
      } else if (data.lockRule && data.lockRule.match(/前(\d+)小时/)) {
        const hours = parseInt(data.lockRule.match(/前(\d+)小时/)[1], 10);
        isLocked = now >= (startTimestamp - (hours * 60 * 60 * 1000));
      }

      // 4. 计算空坑位数组 (用于 wxml 循环渲染几个灰色的圈)
      const emptyCount = Math.max(0, data.targetPlayers - data.currentPlayers);
      const emptySlots = new Array(emptyCount).fill(1);

      this.setData({
        teamup: data,
        hasJoined,
        isLocked,
        isFull,
        emptySlots,
        isLoading: false
      });
    })
  },

  /**
   * 上车逻辑
   */
  joinTeamup() {
    if (!this.data.currentUser) {
      return wx.showModal({
        title: '未登录',
        content: '请先前往个人中心注册/登录',
        success: (res) => {
          if (res.confirm) wx.switchTab({ url: '/pages/profile/profile' })
        }
      });
    }

    if (this.data.isLocked) {
      return wx.showToast({ title: '该次组局临近开始时间，已锁定', icon: 'none' });
    }

    wx.showLoading({ title: '上车中...' });

    // 构造要加入的玩家精简信息
    const newPlayer = {
      openid: this.data.currentUser._openid,
      avatarUrl: this.data.currentUser.avatarUrl,
      isCreator: false
    };

    // 云数据库原子操作：向数组追加元素，且人数+1
    db.collection('teamups').doc(this.data.teamupId).update({
      data: {
        joinedPlayers: _.push(newPlayer),
        currentPlayers: _.inc(1)
      }
    }).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '上车成功！', icon: 'success' });
      this.fetchTeamupDetail(); // 重新拉取数据刷新页面
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '上车失败', icon: 'error' });
    });
  },

  /**
   * 跳车/退出逻辑
   */
  quitTeamup() {
    if (this.data.isLocked) {
      // 如果已经锁车了，给出跳车警告
      wx.showModal({
        title: '警告',
        content: '该次组局临近开始时间，加入后不可退出。此时强行跳车将扣除您的信用分！确定要跳车吗？',
        confirmColor: '#e53935',
        success: (res) => {
          if (res.confirm) {
            // 这里可以加上扣除信用分的逻辑，为了MVP流程我们先只执行退车
            this.executeQuit();
          }
        }
      });
    } else {
      // 未锁车，正常退出
      wx.showModal({
        title: '确认退出',
        content: '确定要退出该拼车局吗？',
        success: (res) => {
          if (res.confirm) this.executeQuit();
        }
      });
    }
  },

  executeQuit() {
    wx.showLoading({ title: '退出中...' });
    // 从数组中移除当前用户，并且人数-1
    db.collection('teamups').doc(this.data.teamupId).update({
      data: {
        joinedPlayers: _.pull({ openid: this.data.currentUser._openid }),
        currentPlayers: _.inc(-1)
      }
    }).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '已退出', icon: 'success' });
      this.fetchTeamupDetail();
    });
  },

  /**
   * 点击头像查看玩家名片
   */
  viewUserCard(e) {
    const openid = e.currentTarget.dataset.openid;
    // 跳转到我们将要写的用户卡片页
    wx.navigateTo({
      url: `/pages/usercard/usercard?openid=${openid}`
    });
  }
})