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
    today: getToday(), // 用于限制日期选择器最小日期
    formDate: '',
    formTime: '',
    lockOptions: ['发车前2小时', '发车前12小时', '发车前24小时', '人满即锁'],
    lockIndex: 1, // 默认选第二个(12小时)
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

    // 必填项校验
    if (!formDate || !formTime) {
      return wx.showToast({ title: '请完善发车时间', icon: 'none' });
    }

    wx.showLoading({ title: '正在创建...' })
    const targetNum = parseInt(scriptInfo.players) || 6; 

    // 写入数据库
    db.collection('teamups').add({
      data: {
        scriptId: scriptId,
        scriptTitle: scriptInfo.title,
        bannerUrl: scriptInfo.bannerUrl, // 冗余图片给大厅展示用
        scriptType: scriptInfo.type,
        targetPlayers: targetNum,
        currentPlayers: 1,
        status: "recruiting",
        
        // --- 新增的表单字段 ---
        startTime: `${formDate} ${formTime}`, // 拼接为 "2026-03-28 14:00"
        lockRule: lockOptions[lockIndex],     // 锁车规则
        merchantNotes: notes,                 // 搭子意向/备注
        
        joinedPlayers: [
          {
            avatarUrl: "/images/default-avatar.png", 
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