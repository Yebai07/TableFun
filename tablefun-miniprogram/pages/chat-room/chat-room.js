// pages/chat-room/chat-room.js
const app = getApp();
Page({
  data: {
    userInfo: null, // 自己
    targetUser: { // 聊天对象
      id: '',
      nickname: '',
      avatarUrl: ''
    },
    inputMsg: '', // 输入框内容
    chatRecords: [], // 聊天记录
    scrollTop: 0, // 滚动位置
    // 邀玩相关（从跳转参数获取）
    inviteType: '', // script/room
    inviteId: '',
    inviteName: ''
  },

  onLoad(options) {
    // 检查登录
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
      return;
    }
    // 初始化自己信息
    this.setData({ userInfo: app.globalData.userInfo });
    // 初始化聊天对象信息
    this.setData({
      targetUser: {
        id: options.targetUserId,
        nickname: decodeURIComponent(options.targetUserName),
        avatarUrl: decodeURIComponent(options.targetUserAvatar)
      }
    });
    // 接收邀玩参数（从剧本/开房页跳转过来的邀玩）
    if (options.inviteType && options.inviteId && options.inviteName) {
      this.setData({
        inviteType: options.inviteType,
        inviteId: options.inviteId,
        inviteName: decodeURIComponent(options.inviteName)
      });
      // 自动发送邀玩消息（可选，也可手动发）
      this.sendInviteMsg();
    }
    // 加载聊天记录
    this.loadChatRecords();
    // 滚动到底部
    this.scrollToBottom();
  },

  onShow() {
    this.scrollToBottom();
  },

  // 加载聊天记录
  loadChatRecords() {
    const targetUserId = this.data.targetUser.id;
    const chatRecords = wx.getStorageSync('chatRecords') || {};
    // 初始化空记录
    if (!chatRecords[targetUserId]) {
      chatRecords[targetUserId] = [];
      wx.setStorageSync('chatRecords', chatRecords);
    }
    this.setData({ chatRecords: chatRecords[targetUserId] });
  },

  // 输入框内容变化
  onInputChange(e) {
    this.setData({ inputMsg: e.detail.value });
  },

  // 发送文字消息
  sendTextMsg() {
    const { inputMsg, userInfo, targetUser } = this.data;
    if (!inputMsg.trim()) {
      wx.showToast({ title: '请输入消息', icon: 'none' });
      return;
    }
    // 构造消息
    const msg = {
      type: 'text',
      content: inputMsg.trim(),
      sendId: userInfo.id,
      receiveId: targetUser.id,
      time: Date.now()
    };
    // 保存消息
    this.saveMsg(msg);
    // 清空输入框
    this.setData({ inputMsg: '' });
    // 滚动到底部
    this.scrollToBottom();
  },

  // 发送邀玩消息（核心匹配功能）
  sendInviteMsg() {
    const { userInfo, targetUser, inviteType, inviteId, inviteName } = this.data;
    if (!inviteType || !inviteId) {
      wx.showToast({ title: '邀玩信息异常', icon: 'none' });
      return;
    }
    // 构造邀玩消息
    const msgContent = `邀请你玩【${inviteName}】，一起组队开黑吧！`;
    const msg = {
      type: 'invite',
      content: msgContent,
      sendId: userInfo.id,
      receiveId: targetUser.id,
      time: Date.now(),
      inviteInfo: {
        type: inviteType,
        id: inviteId,
        name: inviteName,
        fromUser: userInfo.nickname
      }
    };
    // 保存消息
    this.saveMsg(msg);
    // 滚动到底部
    this.scrollToBottom();
    wx.showToast({ title: '邀玩消息已发送', icon: 'success' });
  },

  // 保存消息并更新会话
  saveMsg(msg) {
    const { userInfo, targetUser } = this.data;
    let chatRecords = wx.getStorageSync('chatRecords') || {};
    let chatSessions = wx.getStorageSync('chatSessions') || [];

    // 1. 保存聊天记录
    chatRecords[targetUser.id].push(msg);
    wx.setStorageSync('chatRecords', chatRecords);

    // 2. 更新/新增会话
    const sessionIndex = chatSessions.findIndex(s => s.targetUser.id === targetUser.id);
    const sessionData = {
      targetUser: targetUser,
      lastMsg: msg.content,
      lastMsgType: msg.type,
      lastMsgTime: msg.time,
      unreadCount: 0 // 自己发送的消息未读为0
    };
    if (sessionIndex > -1) {
      chatSessions[sessionIndex] = sessionData;
    } else {
      chatSessions.push(sessionData);
    }
    wx.setStorageSync('chatSessions', chatSessions);

    // 3. 更新页面聊天记录
    this.setData({ chatRecords: chatRecords[targetUser.id] });
  },

  // 滚动到底部
  scrollToBottom() {
    this.setData({ scrollTop: 999999 });
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
})