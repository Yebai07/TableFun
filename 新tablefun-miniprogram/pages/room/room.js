// pages/room/room.js
const app = getApp();

Page({
  data: {
    roomId: null,
    room: {},
    isOwner: false,
    gamePhase: 'waiting',
    gameStage: 'read',
    currentPhaseName: '阅读剧本',
    isReady: false,
    myRole: null,
    players: [],
    messages: [],
    chatText: '',
    myClues: [],
    voteOptions: [],
    revealedRoles: null,
    gameResult: '',
    canStartGame: false
  },

  onLoad(options) {
    const roomId = options.roomId;
    const isCreator = options.isCreator === 'true';

    this.setData({
      roomId,
      isOwner: isCreator
    });

    this.loadRoom(roomId);
  },

  onShow() {
    // 刷新房间信息
    if (this.data.roomId) {
      this.loadRoom(this.data.roomId);
    }
  },

  // 加载房间信息
  loadRoom(roomId) {
    const myRooms = wx.getStorageSync('myRooms') || [];
    const room = myRooms.find(r => r.id === parseInt(roomId));

    if (room) {
      // 初始化玩家列表（模拟数据）
      const players = this.generateMockPlayers(room);

      this.setData({
        room,
        players,
        canStartGame: this.checkCanStartGame(room, players)
      });
    } else {
      wx.showToast({
        title: '房间不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 1500);
    }
  },

  // 生成模拟玩家数据
  generateMockPlayers(room) {
    const app = getApp();
    const players = [];

    // 添加房主
    players.push({
      id: room.ownerId,
      nickname: room.ownerName || '房主',
      isOwner: true,
      isReady: true,
      role: null
    });

    // 添加其他模拟玩家
    if (room.currentPlayers > 1) {
      const mockPlayers = ['小明', '小红', '小刚', '小李', '小华'];
      for (let i = 1; i < Math.min(room.currentPlayers, room.maxPlayers); i++) {
        players.push({
          id: `player${i}`,
          nickname: mockPlayers[i - 1] || `玩家${i}`,
          isOwner: false,
          isReady: Math.random() > 0.3,
          role: null
        });
      }
    }

    return players;
  },

  // 检查是否可以开始游戏
  checkCanStartGame(room, players) {
    return players.length >= room.maxPlayers && players.every(p => p.isReady);
  },

  // 选择角色
  selectCharacter(e) {
    const char = e.currentTarget.dataset.char;
    const room = this.data.room;

    // 分配角色给当前用户
    const updatedCharacters = room.script.characters.map(c => {
      if (c.name === char.name) {
        return { ...c, assigned: app.globalData.userId };
      }
      return c;
    });

    this.setData({
      'room.script.characters': updatedCharacters
    });
  },

  // 切换准备状态
  toggleReady() {
    const isReady = !this.data.isReady;

    // 更新玩家准备状态
    const players = this.data.players.map(p => {
      if (p.id === app.globalData.userId) {
        return { ...p, isReady };
      }
      return p;
    });

    this.setData({
      isReady,
      players,
      canStartGame: this.checkCanStartGame(this.data.room, players)
    });

    wx.showToast({
      title: isReady ? '已准备' : '取消准备',
      icon: 'none'
    });
  },

  // 开始游戏
  startGame() {
    if (!this.checkCanStartGame(this.data.room, this.data.players)) {
      wx.showToast({
        title: '所有玩家必须准备',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '开始游戏',
      content: '确定要开始游戏吗？',
      success: (res) => {
        if (res.confirm) {
          this.initializeGame();
        }
      }
    });
  },

  // 初始化游戏
  initializeGame() {
    wx.showLoading({ title: '初始化游戏...' });

    setTimeout(() => {
      wx.hideLoading();

      // 分配角色
      const room = this.data.room;
      const players = this.data.players;

      // 为每个玩家分配角色
      const characters = room.script.characters;
      players.forEach((player, index) => {
        if (index < characters.length) {
          player.role = characters[index].name;
          // 生成角色剧本
          player.roleContent = this.generateRoleScript(characters[index]);
        }
      });

      // 获取当前用户的角色
      const myPlayer = players.find(p => p.id === app.globalData.userId);
      const myRole = myPlayer ? {
        name: myPlayer.role,
        gender: characters.find(c => c.name === myPlayer.role)?.gender || '未知',
        content: myPlayer.roleContent
      } : null;

      // 生成线索
      const myClues = this.generateClues();

      // 生成投票选项
      const voteOptions = players.map(p => ({
        id: p.id,
        name: p.nickname,
        votes: 0
      }));

      this.setData({
        gamePhase: 'playing',
        gameStage: 'read',
        currentPhaseName: '阅读剧本',
        players,
        myRole,
        myClues,
        voteOptions
      });

      wx.showToast({
        title: '游戏开始！',
        icon: 'success'
      });
    }, 1000);
  },

  // 生成角色剧本
  generateRoleScript(character) {
    const scripts = {
      '陈医生': '你是一位经验丰富的医生，在这座古宅工作已经三年。今晚，你听到主人书房传来一声尖叫。当你冲进去时，发现主人已经身亡。你知道有人一直在暗中调查古宅的秘密，那个人就是你...',
      '林小姐': '你是一位年轻的村姑，三年前来到这座古宅当女佣。表面上看你柔弱胆小，但实际上你是为了调查十年前的事件。今晚是你等待已久的机会...',
      '王管家': '你是古宅的老管家，在这里工作了三十年。你见证了古宅的兴衰，也隐藏着不为人知的秘密。今晚的死亡事件，似乎与你过去的某种选择有关...',
      '张商人': '你是一位精明的商人，听说古宅中有宝藏而来。但你没想到的是，这里不仅有宝藏，还有更大的秘密。当你准备离开时，事情发生了变化...',
      '李夫人': '你是古宅女主人的妹妹，一直觊觎姐姐的地位。今晚的事件是你计划的一部分，但事情的发展超出了你的预期...',
      '赵侦探': '你是一位受人尊敬的侦探，受邀来到古宅调查一起悬案。今晚的死亡事件给了你更多线索，但同时也把你卷入了一个更大的谜团...'
    };

    return scripts[character.name] || '暂无剧本内容';
  },

  // 生成线索
  generateClues() {
    return [
      { number: 1, content: '书房的窗户是从内部锁上的' },
      { number: 2, content: '死者生前最后见的人是林小姐' },
      { number: 3, content: '王管家房中发现了备用钥匙' },
      { number: 4, content: '李夫人的包里有毒药' },
      { number: 5, content: '张商人的账本中有大额债务记录' }
    ];
  },

  // 完成阅读
  finishReading() {
    this.setData({
      gameStage: 'clues',
      currentPhaseName: '查看线索'
    });
  },

  // 显示线索交换
  showCluesExchange() {
    wx.showToast({
      title: '线索交换功能开发中',
      icon: 'none'
    });
  },

  // 开始投票
  startVoting() {
    this.setData({
      gameStage: 'vote',
      currentPhaseName: '投票环节'
    });
  },

  // 投票
  castVote(e) {
    const id = e.currentTarget.dataset.id;
    const voteOptions = this.data.voteOptions.map(v => {
      if (v.id === id) {
        return { ...v, votes: v.votes + 1 };
      }
      return v;
    });

    this.setData({ voteOptions });
    wx.showToast({
      title: '投票成功',
      icon: 'success'
    });

    // 显示游戏结果
    setTimeout(() => {
      this.showGameResult();
    }, 2000);
  },

  // 显示游戏结果
  showGameResult() {
    const revealedRoles = this.data.players.map(p => ({
      playerName: p.nickname,
      characterName: p.role
    }));

    this.setData({
      gameStage: 'result',
      currentPhaseName: '游戏结束',
      revealedRoles,
      gameResult: '经过激烈的讨论和推理，最终大家找到了真相。赵侦探通过细致的观察和严密的逻辑，成功推理出了真正的凶手。这真是一场精彩的游戏！'
    });
  },

  // 离开房间
  leaveRoom() {
    wx.showModal({
      title: '提示',
      content: '确定要离开房间吗？',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      }
    });
  },

  // 聊天输入
  onChatInput(e) {
    this.setData({
      chatText: e.detail.value
    });
  },

  // 发送聊天消息
  sendChatMessage() {
    if (!this.data.chatText.trim()) return;

    const message = {
      id: Date.now(),
      senderId: app.globalData.userId,
      senderName: app.globalData.userInfo?.nickname || '我',
      text: this.data.chatText,
      time: this.formatTime(new Date())
    };

    const messages = [...this.data.messages, message];
    this.setData({
      messages,
      chatText: '',
      scrollToMessage: `msg-${message.id}`
    });
  },

  // 格式化时间
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
})
