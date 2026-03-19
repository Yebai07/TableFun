// pages/create-room/create-room.js
Page({
  data: {
    selectedScript: {},
    roomName: '',
    roomPassword: '',
    roomDesc: '',
    isPublic: true,
    enableVoice: true,
    autoStart: false,
    showScriptModal: false,
    scripts: [
      {
        id: 1,
        name: '午夜惊魂',
        type: '恐怖',
        playerCount: 6,
        cover: '/images/script-cover-1.png',
        characters: [
          { name: '陈医生', gender: '男', assigned: null },
          { name: '林小姐', gender: '女', assigned: null },
          { name: '王管家', gender: '男', assigned: null },
          { name: '张商人', gender: '男', assigned: null },
          { name: '李夫人', gender: '女', assigned: null },
          { name: '赵侦探', gender: '男', assigned: null }
        ]
      },
      {
        id: 2,
        name: '迷雾侦探',
        type: '推理',
        playerCount: 5,
        cover: '/images/script-cover-2.png',
        characters: [
          { name: '宋律师', gender: '男', assigned: null },
          { name: '钱医生', gender: '男', assigned: null },
          { name: '陈秘书', gender: '女', assigned: null },
          { name: '王司机', gender: '男', assigned: null },
          { name: '赵管家', gender: '女', assigned: null }
        ]
      },
      {
        id: 3,
        name: '宫廷秘史',
        type: '古风',
        playerCount: 7,
        cover: '/images/script-cover-3.png',
        characters: [
          { name: '太子', gender: '男', assigned: null },
          { name: '皇后', gender: '女', assigned: null },
          { name: '贵妃', gender: '女', assigned: null },
          { name: '公主', gender: '女', assigned: null },
          { name: '太傅', gender: '男', assigned: null },
          { name: '将军', gender: '男', assigned: null },
          { name: '宫女', gender: '女', assigned: null }
        ]
      }
    ]
  },

  onLoad(options) {
    // 如果从剧本详情页跳转过来，直接选择该剧本
    if (options.scriptId) {
      const script = this.data.scripts.find(s => s.id === parseInt(options.scriptId));
      if (script) {
        this.setData({
          selectedScript: script,
          roomName: `${script.name}的房间`
        });
      }
    }
  },

  // 房间名称输入
  onRoomNameInput(e) {
    this.setData({
      roomName: e.detail.value
    });
  },

  // 房间密码输入
  onRoomPasswordInput(e) {
    this.setData({
      roomPassword: e.detail.value
    });
  },

  // 房间说明输入
  onRoomDescInput(e) {
    this.setData({
      roomDesc: e.detail.value
    });
  },

  // 公开设置切换
  onPublicChange(e) {
    this.setData({
      isPublic: e.detail.value
    });
  },

  // 语音设置切换
  onVoiceChange(e) {
    this.setData({
      enableVoice: e.detail.value
    });
  },

  // 自动开始设置切换
  onAutoStartChange(e) {
    this.setData({
      autoStart: e.detail.value
    });
  },

  // 选择剧本
  selectScript() {
    this.setData({
      showScriptModal: true
    });
  },

  // 隐藏剧本选择弹窗
  hideScriptModal() {
    this.setData({
      showScriptModal: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 确认选择剧本
  confirmSelectScript(e) {
    const script = e.currentTarget.dataset.script;
    this.setData({
      selectedScript: script,
      roomName: `${script.name}的房间`,
      showScriptModal: false
    });
  },

  // 创建房间
  createRoom() {
    const { selectedScript, roomName, roomPassword, roomDesc, isPublic, enableVoice, autoStart } = this.data;

    // 验证必填项
    if (!selectedScript.id) {
      wx.showToast({
        title: '请选择剧本',
        icon: 'none'
      });
      return;
    }

    if (!roomName.trim()) {
      wx.showToast({
        title: '请输入房间名称',
        icon: 'none'
      });
      return;
    }

    // 检查用户登录
    const app = getApp();
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.switchTab({
            url: '/pages/profile/profile'
          });
        }
      });
      return;
    }

    // 创建房间
    wx.showLoading({ title: '创建中...' });

    // 模拟创建房间
    setTimeout(() => {
      wx.hideLoading();

      // 生成房间ID
      const roomId = Date.now();

      // 保存房间信息
      const room = {
        id: roomId,
        name: roomName,
        password: roomPassword,
        desc: roomDesc,
        script: selectedScript,
        isPublic,
        enableVoice,
        autoStart,
        ownerId: app.globalData.userId,
        ownerName: app.globalData.userInfo.nickname,
        status: 'waiting',
        currentPlayers: 1,
        maxPlayers: selectedScript.playerCount,
        createTime: new Date().getTime()
      };

      // 保存到本地存储
      const rooms = wx.getStorageSync('myRooms') || [];
      rooms.push(room);
      wx.setStorageSync('myRooms', rooms);

      // 保存到进行中的房间
      const activeRooms = wx.getStorageSync('activeRooms') || [];
      activeRooms.push({
        id: roomId,
        name: roomName,
        scriptName: selectedScript.name,
        scriptCover: selectedScript.cover,
        time: '刚刚',
        status: 'waiting'
      });
      wx.setStorageSync('activeRooms', activeRooms);

      wx.showToast({
        title: '创建成功',
        icon: 'success'
      });

      // 跳转到房间页面
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/room/room?roomId=${roomId}&isCreator=true`
        });
      }, 1500);
    }, 1000);
  }
})
