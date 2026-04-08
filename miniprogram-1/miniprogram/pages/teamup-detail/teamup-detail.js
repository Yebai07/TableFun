const db = wx.cloud.database()

Page({
  data: {
    // 基础 ID 与数据
    teamupId: '',
    teamup: {},
    isLoading: true, // 初始为 true，防止按钮闪烁
    
    // UI 状态控制
    emptySlots: [],   
    hasJoined: false, 
    isLocked: false,  
    isFull: false,    
    
    timer: null,      // 倒计时定时器
    currentUser: null // 当前登录用户
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({ teamupId: options.id });
      
      // 获取用户信息（从缓存拿）
      const cachedData = wx.getStorageSync('cachedUserInfo');
      if (cachedData && cachedData.userInfo) {
        this.setData({ currentUser: cachedData.userInfo });
      }
      
      this.fetchTeamupDetail();
    }
  },

  // 页面隐藏或卸载时，必须清除定时器，否则会耗电且报错
  onHide() { if (this.data.timer) clearInterval(this.data.timer); },
  onUnload() { if (this.data.timer) clearInterval(this.data.timer); },

  /**
   * 核心：从云数据库拉取拼车实时详情
   */
  fetchTeamupDetail() {
    db.collection('teamups').doc(this.data.teamupId).get().then(res => {
      const data = res.data;
      
      // 1. 判断自己是否在车上
      let hasJoined = false;
      const myOpenid = this.data.currentUser?._openid || this.data.currentUser?.openid;
      if (myOpenid) {
        hasJoined = data.joinedPlayers.some(p => p.openid === myOpenid);
      }

      // 2. 初始计算状态、倒计时文本与坑位
      this.refreshUIState(data, hasJoined);

      // 3. 开启定时器每分钟刷新一次倒计时文字
      if (this.data.timer) clearInterval(this.data.timer);
      const timer = setInterval(() => {
        // 定时器刷新时，基于当前 data 里的 teamup 继续计算
        this.refreshUIState(this.data.teamup, this.data.hasJoined);
      }, 60000);

      this.setData({ timer });
      
      // 设置顶部标题为剧本名
      wx.setNavigationBarTitle({ title: data.scriptTitle || '拼车详情' });
    }).catch(err => {
      console.error('获取详情失败', err);
      wx.showToast({ title: '该组局已失效', icon: 'none' });
    })
  },

  /**
   * 统一刷新函数：处理倒计时文本、锁车判定、空坑位计算
   */
  refreshUIState(teamup, hasJoined) {
    const now = new Date().getTime();
    const startTimeStr = teamup.startTime.replace(/-/g, '/');
    const startTimestamp = new Date(startTimeStr).getTime();
    const isFull = teamup.currentPlayers >= teamup.targetPlayers;
    
    let isLocked = false;
    let lockStatusText = '';

    // A. 判定锁车逻辑 (与发车设置保持绝对同步)
    if (teamup.lockWhenFull && isFull) {
      isLocked = true;
      lockStatusText = "已满员锁车";
    } else {
      const hours = teamup.lockHours || 0;
      const deadline = startTimestamp - (hours * 60 * 60 * 1000);
      const diff = deadline - now;

      if (hours === 0 && diff > 0) {
        isLocked = false;
        lockStatusText = "发车前不锁定";
      } else if (diff <= 0 || now >= startTimestamp) {
        isLocked = true;
        lockStatusText = "已锁车";
      } else {
        isLocked = false;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (h > 24) {
          lockStatusText = `距锁定还有${Math.floor(h/24)}天`;
        } else if (h > 0) {
          lockStatusText = `距锁定还有${h}小时${m}分`;
        } else {
          lockStatusText = `距锁定还有${m}分`;
        }
      }
    }

    // B. 计算空坑位 (Array.from 确保 Key 唯一，解决 wx:key 报错)
    const emptyCount = Math.max(0, teamup.targetPlayers - teamup.currentPlayers);
    const emptySlots = Array.from({ length: emptyCount }, (v, i) => i);

    // C. 同步所有状态并关闭加载锁
    teamup.lockStatusText = lockStatusText;
    this.setData({
      teamup: teamup,
      isLocked: isLocked,
      isFull: isFull,
      hasJoined: hasJoined,
      emptySlots: emptySlots,
      isLoading: false // 到这里才显示页面内容和按钮，防止闪烁
    });
  },

  /**
   * 上车逻辑：调用云函数绕过权限限制
   */
  joinTeamup() {
    if (!this.data.currentUser) {
      return wx.showModal({
        title: '提示',
        content: '请先登录/注册后再参与组局',
        confirmText: '去登录',
        success: (res) => { if (res.confirm) wx.switchTab({ url: '/pages/profile/profile' }) }
      });
    }

    if (this.data.isLocked) return wx.showToast({ title: '该车已锁定，无法加入', icon: 'none' });
    if (this.data.isFull) return wx.showToast({ title: '车已经满了哦', icon: 'none' });

    wx.showLoading({ title: '正在加入...', mask: true });
    
    wx.cloud.callFunction({
      name: 'manageTeamup',
      data: {
        type: 'join',
        teamupId: this.data.teamupId,
        playerInfo: {
          avatarUrl: this.data.currentUser.avatarUrl,
          nickname: this.data.currentUser.nickname
        }
      },
      success: (res) => {
        wx.hideLoading();
        if (res.result && res.result.success) {
          wx.showToast({ title: '上车成功！', icon: 'success' });
          this.fetchTeamupDetail(); // 重新拉取数据刷新页面
        } else {
          wx.showToast({ title: res.result.msg || '操作失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络繁忙', icon: 'none' });
      }
    });
  },

  /**
   * 退出逻辑：根据锁车状态给出不同警告
   */
  quitTeamup() {
    const isWarn = this.data.isLocked;
    wx.showModal({
      title: isWarn ? '强行跳车警告' : '确认退出',
      content: isWarn ? '已过锁车时间，强行跳车将扣除您的信用分！确定要退出吗？' : '确定要退出该拼车局吗？',
      confirmColor: isWarn ? '#ff5a5f' : '#333',
      success: (res) => {
        if (res.confirm) this.executeQuit();
      }
    });
  },

  /**
   * 执行真正的退出（云函数处理）
   */
  executeQuit() {
    const isLocked = this.data.isLocked; // 记录是否锁车状态
    wx.showLoading({ title: '正在退出...', mask: true });
    wx.cloud.callFunction({
      name: 'manageTeamup',
      data: { 
        type: 'quit', 
        teamupId: this.data.teamupId 
      },
      success: (res) => {
        wx.hideLoading();
        if (res.result && res.result.success) {
          // 如果锁车后跳车，扣除100信用分
          if (isLocked) {
            this.deductCreditScore();
          } else {
            wx.showToast({ title: '已成功下车', icon: 'success' });
            this.fetchTeamupDetail();
          }
        }
      }
    });
  },

  /**
   * 扣除信用分
   */
  deductCreditScore() {
    const db = wx.cloud.database();
    const _ = db.command;
    const currentUser = this.data.currentUser;
    
    if (!currentUser) {
      wx.showToast({ title: '已成功下车', icon: 'success' });
      this.fetchTeamupDetail();
      return;
    }

    wx.showLoading({ title: '扣除信用分...', mask: true });

    // 使用 openid 查询用户文档，因为缓存中可能没有 _id
    const openid = currentUser._openid || currentUser.openid;
    
    // 先查询获取用户的 _id
    db.collection('users').where({
      _openid: openid
    }).get().then(res => {
      if (res.data.length === 0) {
        throw new Error('用户不存在');
      }
      
      const userDoc = res.data[0];
      const userId = userDoc._id;
      const currentScore = userDoc.creditScore || 800;
      const existingRecords = userDoc.creditRecords || [];

      // 1. 扣除信用分并添加记录
      const newRecord = {
        id: Date.now(),
        type: 'penalty',
        title: '锁车跳车扣减',
        change: '-100',
        score: currentScore - 100,
        time: new Date().toLocaleString('zh-CN'),
        description: '组局已锁车后强制退出，扣除信用分'
      };

      return db.collection('users').doc(userId).update({
        data: {
          creditScore: _.inc(-100),
          creditRecords: [newRecord, ...existingRecords]
        }
      });
    }).then(() => {
      // 更新本地缓存，确保个人中心页面和信用分详情页面能显示最新数据
      const cachedData = wx.getStorageSync('cachedUserInfo');
      if (cachedData && cachedData.userInfo) {
        const currentScore = cachedData.userInfo.creditScore || 800;
        const existingRecords = cachedData.userInfo.creditRecords || [];
        
        // 创建新的扣分记录
        const newRecord = {
          id: Date.now(),
          type: 'penalty',
          title: '锁车跳车扣减',
          change: '-100',
          score: currentScore - 100,
          time: new Date().toLocaleString('zh-CN'),
          description: '组局已锁车后强制退出，扣除信用分'
        };
        
        const updatedUserInfo = {
          ...cachedData.userInfo,
          creditScore: currentScore - 100,
          creditRecords: [newRecord, ...existingRecords]
        };
        wx.setStorageSync('cachedUserInfo', {
          userInfo: updatedUserInfo,
          timestamp: Date.now()
        });
      }
      
      wx.hideLoading();
      wx.showModal({
        title: '已扣除信用分',
        content: '您已在锁车后退出组局，信用分已扣除100分。',
        showCancel: false,
        success: () => {
          this.fetchTeamupDetail();
        }
      });
    }).catch(err => {
      wx.hideLoading();
      console.error('扣除信用分失败', err);
      wx.showToast({ title: '已成功下车', icon: 'success' });
      this.fetchTeamupDetail();
    });
  },

  /**
   * 点击头像查看玩家名片
   */
  viewUserCard(e) {
    const openid = e.currentTarget.dataset.openid;
    if (openid) {
      wx.navigateTo({ url: `/pages/usercard/usercard?openid=${openid}` });
    }
  },

  /**
   * 点击剧本卡片，回退到剧本详情
   */
  goToScriptDetail() {
    if (this.data.teamup.scriptId) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${this.data.teamup.scriptId}`
      });
    }
  }
})