const db = wx.cloud.database()

Page({
  data: {
    showPopup: false, // <--- 新增这行，控制发车弹窗显示与隐藏
    
    // 基础表单数据
    scriptId: '',
    scriptInfo: null, // 存放从数据库拉取回来的剧本信息
    formDate: '',
    formTime: '',
    notes: '',

    // 限制器数据
    today: '',
    timeStart: '00:00', 

    // 锁车策略 
    lockHours: 0,       
    lockWhenFull: false, 

    isLoading: false
  },

  onLoad(options) {
    // 1. 初始化日期和时间限制
    const todayStr = this.getToday();
    const now = new Date();
    const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    this.setData({ 
      today: todayStr,
      timeStart: currentHourMin 
    });

    // 2. 核心修复：拿到 ID 后，去数据库查询完整的剧本信息
    if (options.id) {
      this.setData({ scriptId: options.id });
      this.fetchScriptDetail(options.id);
    }
  },
  /**
     * 打开/关闭发车弹窗
     */
  openPopup() {
    this.setData({ showPopup: true });
  },

  closePopup() {
    this.setData({ showPopup: false });
  },
  /**
   * 恢复被误删的逻辑：去数据库拉取剧本详情
   */
  fetchScriptDetail(id) {
    wx.showLoading({ title: '加载剧本中...' });
    db.collection('scripts').doc(id).get().then(res => {
      wx.hideLoading();
      this.setData({ scriptInfo: res.data });
    }).catch(err => {
      wx.hideLoading();
      console.error('获取剧本信息失败', err);
      wx.showToast({ title: '加载剧本失败', icon: 'none' });
    });
  },

  /**
   * 获取今天的日期字符串 (YYYY-MM-DD)
   */
  getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 日期切换监听
   */
  onDateChange(e) {
    const selectedDate = e.detail.value;
    let newTimeStart = '00:00';

    if (selectedDate === this.data.today) {
      const now = new Date();
      newTimeStart = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    let newFormTime = this.data.formTime;
    if (newFormTime && selectedDate === this.data.today && newFormTime < newTimeStart) {
      newFormTime = '';
      wx.showToast({ title: '已重置失效时间', icon: 'none' });
    }

    this.setData({ 
      formDate: selectedDate, 
      timeStart: newTimeStart,
      formTime: newFormTime
    });
  },

  /**
   * 基础输入绑定
   */
  onTimeChange(e) { this.setData({ formTime: e.detail.value }) },
  onNoteInput(e) { this.setData({ notes: e.detail.value }) },
  onLockHoursChange(e) { this.setData({ lockHours: e.detail.value }) },
  onLockWhenFullChange(e) { this.setData({ lockWhenFull: e.detail.value }) },

  /**
   * 提交发车逻辑
   */
  submitTeamup() {
    const { formDate, formTime, lockHours, lockWhenFull, notes, scriptInfo, scriptId } = this.data;

    if (!scriptInfo) {
      return wx.showToast({ title: '剧本信息还在加载', icon: 'none' });
    }

    if (!formDate || !formTime) {
      return wx.showToast({ title: '请选择开始时间', icon: 'none' });
    }

    const now = new Date().getTime();
    const startTimestamp = new Date(`${formDate.replace(/-/g, '/')} ${formTime}`).getTime();
    if (startTimestamp <= now) {
      return wx.showToast({ title: '发车时间已失效，请重选', icon: 'none' });
    }

    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (!cachedData || !cachedData.userInfo) {
      return wx.showToast({ title: '请先登录', icon: 'none' });
    }
    const user = cachedData.userInfo;

    this.setData({ isLoading: true });
    wx.showLoading({ title: '正在发起...', mask: true });

    // 构造写入数据库的数据模型
    const teamupData = {
      scriptId: scriptId,
      scriptTitle: scriptInfo.title || scriptInfo.name, // 加了备用字段防报错
      scriptType: scriptInfo.type,
      scriptPlayers: scriptInfo.players,
      bannerUrl: scriptInfo.bannerUrl || scriptInfo.cover, // 加了备用字段防报错
      
      startTime: `${formDate} ${formTime}`,
      notes: notes,
      
      lockHours: lockHours,
      lockWhenFull: lockWhenFull,
      
      targetPlayers: parseInt(scriptInfo.players) || 6,
      currentPlayers: 1,
      
      joinedPlayers: [{
        openid: user._openid || user.openid,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        isCreator: true
      }],
      
      createTime: db.serverDate(),
      status: '招募中'
    };

    db.collection('teamups').add({
      data: teamupData,
      success: (res) => {
        wx.hideLoading();
        wx.showToast({ title: '发车成功！', icon: 'success' });
        setTimeout(() => {
          wx.switchTab({ url: '/pages/lobby/lobby' });
        }, 1500);
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '发车失败，请重试', icon: 'none' });
        console.error('Submit Error:', err);
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  }
})