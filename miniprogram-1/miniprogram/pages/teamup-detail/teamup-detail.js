const db = wx.cloud.database();
const _ = db.command;
const { calcLockStatus } = require('../../utils');

Page({
  data: {
    teamupId: '',
    teamup: {},
    isLoading: true,
    emptySlots: [],
    hasJoined: false,
    isCreator: false,
    isLocked: false,
    isFull: false,
    timer: null,
    isDisbanding: false,
    currentUser: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ teamupId: options.id });
      const cached = wx.getStorageSync('cachedUserInfo');
      if (cached && cached.userInfo) {
        this.setData({ currentUser: cached.userInfo });
      }
      this.fetchTeamupDetail();
    }
  },

  onHide() { if (this.data.timer) clearInterval(this.data.timer); },
  onUnload() { if (this.data.timer) clearInterval(this.data.timer); },

  fetchTeamupDetail() {
    if (this.data.isDisbanding) return;
    db.collection('teamups').doc(this.data.teamupId).get().then(res => {
      const data = res.data;
      const myOpenid = this.data.currentUser?._openid || this.data.currentUser?.openid;
      const hasJoined = myOpenid ? data.joinedPlayers.some(p => p.openid === myOpenid) : false;
      const isCreator = myOpenid ? data.joinedPlayers.some(p => p.openid === myOpenid && p.isCreator) : false;

      this.refreshUIState(data, hasJoined, isCreator);

      if (this.data.timer) clearInterval(this.data.timer);
      const timer = setInterval(() => {
        this.refreshUIState(this.data.teamup, this.data.hasJoined, this.data.isCreator);
      }, 60000);
      this.setData({ timer });

      wx.setNavigationBarTitle({ title: data.scriptTitle || '拼车详情' });
    }).catch(err => {
      console.error('获取详情失败', err);
      wx.showToast({ title: '该组局已失效', icon: 'none' });
    });
  },

/**
   * 统一刷新函数：处理倒计时文本、锁车判定、空坑位计算
   */
refreshUIState(teamup, hasJoined) {
  const now = new Date().getTime();
  const startTimeStr = teamup.startTime.replace(/-/g, '/');
  const startTimestamp = new Date(startTimeStr).getTime();
  const isFull = teamup.currentPlayers >= teamup.targetPlayers;
  
  // 🚀 新增：判断该剧本是否已经开始/结束
  const isPast = now >= startTimestamp;

  let isLocked = false;
  let lockStatusText = '';

  // A. 判定锁车逻辑
  if (isPast) {
    isLocked = true;
    lockStatusText = "已发车/已结束"; // 时间过了，直接显示已结束
  } else if (teamup.lockWhenFull && isFull) {
    isLocked = true;
    lockStatusText = "已满员锁车";
  } else {
    const hours = teamup.lockHours || 0;
    const deadline = startTimestamp - (hours * 60 * 60 * 1000);
    const diff = deadline - now;

    if (hours === 0 && diff > 0) {
      isLocked = false;
      lockStatusText = "发车前不锁定";
    } else if (diff <= 0) {
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

  // B. 计算空坑位
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
    isPast: isPast, // 🚀 关键：把是否过期传给前端 WXML
    isLoading: false 
  });
},

  joinTeamup() {
    if (!this.data.currentUser) {
      return wx.showModal({
        title: '提示',
        content: '请先登录/注册后再参与组局',
        confirmText: '去登录',
        success: (res) => { if (res.confirm) wx.switchTab({ url: '/pages/profile/profile' }); }
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
          this.fetchTeamupDetail();
        } else {
          wx.showToast({ title: res.result.msg || '操作失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络繁忙', icon: 'none' });
      }
    });
  },

/**
   * 退出逻辑：根据锁车状态和人数给出不同警告
   */
quitTeamup() {
  // 1. 获取当前车上的实际人数（加个容错，万一还没渲染出来默认为 1）
  const playersCount = this.data.teamup.joinedPlayers ? this.data.teamup.joinedPlayers.length : 1;
  
  // 2. 只有在【已锁车】并且【车上不止一人】的情况下，才弹出扣分警告
  const isWarn = this.data.isLocked && playersCount > 1;
  
  // 3. 判断是不是只有自己一个人
  const isSolo = playersCount === 1;

  // 4. 动态生成标题和内容
  let title = isWarn ? '强行跳车警告' : (isSolo ? '确认解散' : '确认退出');
  
  let content = '';
  if (isWarn) {
    content = '已过锁定时间，强行跳车将扣除 50 信用分！确定要退出吗？';
  } else if (isSolo) {
    content = '当前组局只有您一人，退出将直接解散该组局。确定要解散吗？'; // 一个人退出的专属提示
  } else {
    content = '确定要退出本组局吗？';
  }

  wx.showModal({
    title: title,
    content: content,
    confirmColor: isWarn ? '#ff5a5f' : '#333',
    success: (res) => {
      if (res.confirm) this.executeQuit();
    }
  });
},

  executeQuit() {
    wx.showLoading({ title: '正在处理...', mask: true });
    
    wx.cloud.callFunction({
      name: 'manageTeamup',
      data: { 
        type: 'quit', 
        teamupId: this.data.teamupId,
        isLocked: this.data.isLocked 
      },
      success: (res) => {
        wx.hideLoading();
        
        // 打印云函数的返回结果，用来排错！
        console.log('====== 云函数退车返回结果 ======', res.result);

        if (res.result && res.result.success) {
          
          // 如果云函数返回了解散信号，或者提示语里包含“解散”字眼（双重保险）
          if (res.result.isDisbanded || res.result.msg.includes('解散')) {
            // 1. 锁上防弹锁
            this.setData({ isDisbanding: true }); 
            
            // 2. 提示并跳转
            wx.showToast({ title: '组局已解散', icon: 'success' });
            setTimeout(() => {
              wx.switchTab({ url: '/pages/lobby/lobby' });
            }, 1000);
            
            return; // 3. 强制截断后续代码
          } 

          // 如果车还在（只是普通下车），才去刷新页面
          wx.showToast({ title: res.result.msg, icon: 'success' });
          this.fetchTeamupDetail(); 
        } else {
          wx.showToast({ title: res.result.msg || '操作失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络异常', icon: 'none' });
      }
    });
  },

  /**
   * 车长踢人（核心需求：防跳车双重约束）
   */
  kickPlayer(e) {
    const openid = e.currentTarget.dataset.openid;
    const nickname = e.currentTarget.dataset.nickname || '该玩家';
    if (!openid || !this.data.isCreator) return;

    wx.showModal({
      title: '踢出玩家',
      content: `确定要将「${nickname}」踢出本局吗？`,
      confirmColor: '#ff5a5f',
      success: (res) => {
        if (!res.confirm) return;
        wx.showLoading({ title: '操作中...', mask: true });
        wx.cloud.callFunction({
          name: 'manageTeamup',
          data: { type: 'kick', teamupId: this.data.teamupId, targetOpenid: openid }
        }).then(r => {
          wx.hideLoading();
          if (r.result && r.result.success) {
            wx.showToast({ title: '已踢出', icon: 'success' });
            this.fetchTeamupDetail();
          } else {
            wx.showToast({ title: r.result.msg || '操作失败', icon: 'none' });
          }
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '网络繁忙', icon: 'none' });
        });
      }
    });
  },

  viewUserCard(e) {
    const openid = e.currentTarget.dataset.openid;
    if (openid) wx.navigateTo({ url: `/pages/usercard/usercard?openid=${openid}` });
  },

  goToScriptDetail() {
    if (this.data.teamup.scriptId) {
      wx.navigateTo({ url: `/pages/detail/detail?id=${this.data.teamup.scriptId}` });
    }
  }
});
