// pages/script-detail/script-detail.js
Page({
  data: {
    scriptId: null,
    script: {},
    isCollected: false
  },
// 新增：找队友（私信邀玩）
goToFindTeammate() {
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
  const { script } = this.data;
  wx.navigateTo({
    url: `/pages/chat-list/chat-list?inviteType=script&inviteId=${script.id}&inviteName=${encodeURIComponent(script.name)}`
  });
},
  onLoad(options) {
    const scriptId = options.id;
    this.setData({ scriptId });
    this.loadScriptDetail(scriptId);
    this.checkCollectStatus();
  },

  // 加载剧本详情
  loadScriptDetail(id) {
    // 模拟剧本详情数据
    const scriptDetails = {
      1: {
        id: 1,
        name: '午夜惊魂',
        type: '恐怖',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.2,
        playCount: 12580,
        roomCount: 328,
        isFree: false,
        price: 100,
        cover: '/images/script-cover-1.png',
        intro: '深夜的古宅，六个陌生人的命运交织在一起。当第一声尖叫划破夜空，每个人都成了嫌疑人。在这场残酷的游戏中，谁能活到最后？',
        story: '民国时期，江南一座偏僻的古宅。传说这里每到午夜时分，就能听到诡异的哭声。六位来自不同背景的人，被神秘信件邀请来到这座古宅。当晚，古宅主人离奇身亡。随着调查的深入，每个人都隐藏着不可告人的秘密...',
        characters: [
          { name: '陈医生', gender: '男', desc: '古宅的私人医生，沉默寡言' },
          { name: '林小姐', gender: '女', desc: '年轻貌美的女佣，眼神中透着恐惧' },
          { name: '王管家', gender: '男', desc: '忠诚的老管家，知道古宅的秘密' },
          { name: '张商人', gender: '男', desc: '精明的商人，来此寻找宝藏' },
          { name: '李夫人', gender: '女', desc: '古宅女主人的妹妹，神色慌张' },
          { name: '赵侦探', gender: '男', desc: '受邀前来的侦探，观察力敏锐' }
        ],
        features: [
          '恐怖氛围浓厚，沉浸式体验',
          '复杂的人物关系，层层迷雾',
          '意想不到的反转结局',
          '适合老玩家挑战'
        ],
        suitable: '适合喜欢恐怖题材、逻辑推理能力强的玩家。建议有3次以上剧本杀经验的玩家参加。',
        notice: '本剧本含有恐怖元素，请做好心理准备。心脏病患者、孕妇及13岁以下儿童不建议游玩。'
      },
      2: {
        id: 2,
        name: '迷雾侦探',
        type: '推理',
        difficulty: '中等',
        playerCount: 5,
        duration: 3,
        rating: 9.5,
        playCount: 23450,
        roomCount: 562,
        isFree: true,
        price: 0,
        cover: '/images/script-cover-2.png',
        intro: '一桩离奇的命案，谁是真正的凶手？在迷雾重重的真相中，只有最敏锐的侦探才能找到答案。',
        story: '20世纪30年代的上海滩，繁华的东方明珠。一位富商在自己的豪宅中离奇身亡。现场没有打斗痕迹，没有明显的凶器，门窗完好无损。五位与死者有关的人，每个人都有杀人动机。是谁，在这看似完美的密室中，完成了这场不可能的犯罪？',
        characters: [
          { name: '宋律师', gender: '男', desc: '死者的法律顾问，精明强干' },
          { name: '钱医生', gender: '男', desc: '死者的私人医生，医术精湛' },
          { name: '陈秘书', gender: '女', desc: '死者的秘书，看似温柔' },
          { name: '王司机', gender: '男', desc: '死者的专职司机，忠诚可靠' },
          { name: '赵管家', gender: '女', desc: '豪宅的老管家，深得信任' }
        ],
        features: [
          '经典推理剧本，逻辑严密',
          '密室杀人，挑战智慧',
          '线索丰富，细节决定成败',
          '适合新手和进阶玩家'
        ],
        suitable: '适合喜欢推理、逻辑思维强的玩家。新手友好，老玩家也能找到乐趣。',
        notice: '本剧本注重逻辑推理，请认真阅读所有线索。'
      },
      3: {
        id: 3,
        name: '宫廷秘史',
        type: '古风',
        difficulty: '简单',
        playerCount: 7,
        duration: 4,
        rating: 8.9,
        playCount: 8920,
        roomCount: 218,
        isFree: false,
        price: 150,
        cover: '/images/script-cover-3.png',
        intro: '皇宫深院，权力与情感的交织。在这场没有硝烟的战争中，每个人都在为自己的欲望而战。',
        story: '古代皇宫，皇帝驾崩，皇位继承之争一触即发。七位与皇位相关的人物，各自心怀鬼胎。是争夺权力的欲望，还是真挚的情感？在这场宫廷斗争中，谁又能笑到最后？',
        characters: [
          { name: '太子', gender: '男', desc: '皇帝长子，野心勃勃' },
          { name: '皇后', gender: '女', desc: '皇帝正妻，深谋远虑' },
          { name: '贵妃', gender: '女', desc: '皇帝宠妃，美艳动人' },
          { name: '公主', gender: '女', desc: '皇帝爱女，纯真善良' },
          { name: '太傅', gender: '男', desc: '皇帝的老师，忠心耿耿' },
          { name: '将军', gender: '男', desc: '朝廷重臣，手握兵权' },
          { name: '宫女', gender: '女', desc: '不起眼的宫女，却有秘密' }
        ],
        features: [
          '古风沉浸式体验',
          '情感与权谋并存',
          '适合cosplay玩家',
          '轻松有趣，适合社交'
        ],
        suitable: '适合喜欢古风、社交的玩家。新手友好，适合聚会。',
        notice: '本剧本适合角色扮演体验，请融入角色。'
      }
    };

    const script = scriptDetails[id] || {
      id: id,
      name: '未知剧本',
      type: '其他',
      difficulty: '未知',
      playerCount: 5,
      duration: 3,
      rating: 0,
      playCount: 0,
      roomCount: 0,
      isFree: true,
      price: 0,
      cover: '/images/script-cover-1.png',
      intro: '暂无简介',
      story: '暂无故事背景',
      characters: [],
      features: ['暂无特色'],
      suitable: '暂无描述',
      notice: '暂无注意事项'
    };

    this.setData({ script });
  },

  // 检查收藏状态
  checkCollectStatus() {
    const collects = wx.getStorageSync('collectedScripts') || [];
    this.setData({
      isCollected: collects.includes(this.data.scriptId)
    });
  },

  // 切换收藏状态
  toggleCollect() {
    const collects = wx.getStorageSync('collectedScripts') || [];
    const scriptId = this.data.scriptId;
    let isCollected = this.data.isCollected;

    if (isCollected) {
      // 取消收藏
      const index = collects.indexOf(scriptId);
      if (index > -1) {
        collects.splice(index, 1);
      }
      isCollected = false;
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      });
    } else {
      // 添加收藏
      collects.push(scriptId);
      isCollected = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }

    wx.setStorageSync('collectedScripts', collects);
    this.setData({ isCollected });
  },

  // 分享剧本
  shareScript() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 前往房间列表
  goToRooms() {
    wx.showToast({
      title: '查看房间',
      icon: 'none'
    });
    // 这里可以跳转到房间列表页面
  },

  // 创建房间
  createRoom() {
    const app = getApp();
    const script = this.data.script;

    // 检查是否登录
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

    // 跳转到创建房间页面
    wx.navigateTo({
      url: `/pages/create-room/create-room?scriptId=${script.id}`
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: `推荐一个好玩的剧本：${this.data.script.name}`,
      path: `/pages/script-detail/script-detail?id=${this.data.scriptId}`,
      imageUrl: this.data.script.cover
    };
  }
})
