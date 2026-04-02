const db = wx.cloud.database()

// 获取今天日期的格式化函数 (YYYY-MM-DD)，防止选以前的日期
const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

Page({
  data: {
    scriptId: '',
    scriptInfo: {},
    isLoading: true,

    // 弹窗表单状态
    showPopup: false,
    today: getToday(), 
    formDate: '',
    formTime: '',
    lockOptions: ['开始前2小时', '开始前12小时', '开始前24小时', '开始即锁 (极度严格)', '不限'],
    lockIndex: 1, 
    notes: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ scriptId: options.id })
      this.fetchScriptDetail(options.id)
    }
  },

  fetchScriptDetail(id) {
    db.collection('scripts').doc(id).get().then(res => {
      this.setData({ scriptInfo: res.data, isLoading: false })
    }).catch(err => {
      console.error('获取剧本详情失败', err)
      this.setData({ isLoading: false })
    })
  },

  // ===== 弹窗控制与表单绑定 =====
  openPopup() { this.setData({ showPopup: true }) },
  closePopup() { this.setData({ showPopup: false }) },
  
  onDateChange(e) { this.setData({ formDate: e.detail.value }) },
  onTimeChange(e) { this.setData({ formTime: e.detail.value }) },
  onLockChange(e) { this.setData({ lockIndex: e.detail.value }) },
  onNotesInput(e) { this.setData({ notes: e.detail.value }) },

  // ===== 核心提交逻辑 =====
  submitTeamup() {
    const { formDate, formTime, lockOptions, lockIndex, notes, scriptInfo, scriptId } = this.data;

    // 1. 必填项校验
    if (!formDate || !formTime) {
      return wx.showToast({ title: '请完善开始时间', icon: 'none' });
    }

    // 2. 获取当前登录用户的真实信息 (核心修复点)
    const cachedData = wx.getStorageSync('cachedUserInfo');
    if (!cachedData || !cachedData.userInfo) {
      return wx.showModal({
        title: '未登录',
        content: '发起拼车前需要先完善个人资料哦',
        success: (res) => {
          if (res.confirm) wx.switchTab({ url: '/pages/profile/profile' })
        }
      });
    }
    const me = cachedData.userInfo;

    wx.showLoading({ title: '正在发车...' })
    const targetNum = parseInt(scriptInfo.players) || 6; 

    // 3. 写入数据库
    db.collection('teamups').add({
      data: {
        scriptId: scriptId,
        scriptTitle: scriptInfo.title,
        bannerUrl: scriptInfo.bannerUrl, 
        scriptType: scriptInfo.type, 
        scriptPlayers: scriptInfo.players, 
        targetPlayers: targetNum,
        currentPlayers: 1,
        status: "recruiting",
        
        startTime: `${formDate} ${formTime}`, 
        lockRule: lockOptions[lockIndex],     
        merchantNotes: notes,                 
        
        joinedPlayers: [
          {
            openid: me._openid || me.openid, // 写入发起人的真实 OpenID
            nickname: me.nickname,           // 写入发起人的真实昵称
            avatarUrl: me.avatarUrl || "/images/default-avatar.png", // 真实头像
            isCreator: true
          }
        ],
        createTime: db.serverDate()
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({ title: '发车成功！', icon: 'success' })
      this.closePopup()
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/lobby/lobby' })
      }, 1500)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '发车失败', icon: 'error' })
      console.error('发起拼本失败：', err)
    })
  }
})