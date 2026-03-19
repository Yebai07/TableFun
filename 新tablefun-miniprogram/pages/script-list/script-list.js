// pages/script-list/script-list.js
const app = getApp();

Page({
  data: {
    currentCity: '北京',
    searchKeyword: '',
    activeType: 'all',
    activeSort: 'hot',
    types: ['恐怖', '推理', '悬疑', '古风', '欧式', '科幻', '情感', '欢乐', '日式', '都市', '热血', '韩式', '惊悚', '暗黑'],
    scripts: [
      {
        id: 1,
        name: '下课后',
        type: '日式',
        difficulty: '困难',
        playerCount: 4,
        duration: 4,
        rating: 9.0,
        playCount: 12580,
        isFree: false,
        price: 75,
        intro: '时茉女校以内设学生风纪部自治闻名。近日，该校组织了一场《夜莺与玫瑰》的话剧表演。而就在演出当天，主角如同故事里般走向了悲剧……',
        cover: '/images/script-cover-1.png'
      },
      {
        id: 2,
        name: '皮囊',
        type: '情感',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.8,
        playCount: 23450,
        isFree: false,
        price: 85,
        intro: 'A本以还原为主，玩家需通过线索卡和记忆片段梳理案发当晚的时间线，初步勾勒出人物关系网。此时你会发现，所有人似乎都与一对名为"春"和"冬"的姐妹有千丝万缕的联系。进入B本后，故事转向更深层的情感过往...',
        cover: '/images/script-cover-2.png'
      },
      {
        id: 3,
        name: '醉凌云',
        type: '古风',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.7,
        playCount: 8920,
        isFree: false,
        price: 75,
        intro: '随着剧情推进，人物关系网逐渐清晰。白未染与痁神殿高手巫弦乐之间展开正邪对立的激烈碰撞，彼此折磨又相互吸引。苏温言与冷寂在身份落差中尝试双向奔赴。苏浅语与方逆在每一次真实的杀意与无奈的妥协中纠缠...',
        cover: '/images/script-cover-3.png'
      },
      {
        id: 4,
        name: '归唐',
        type: '古风',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.6,
        playCount: 15630,
        isFree: false,
        price: 65,
        intro: '在压抑的现实间隙，一次"夜游长安"的沉浸演绎成为全剧最浪漫的转折。你们仿佛真的穿越到了盛世长安，见到了亭台楼阁，尝到了羊肉汤，感受到了何为"大唐"。这个共同的梦境，让"归唐"从一个模糊的口号，变成了所有人愿意为之赴死的具体向往...',
        cover: '/images/script-cover-4.png'
      },
      {
        id: 5,
        name: '爱玫',
        type: '欧式',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.5,
        playCount: 7890,
        isFree: false,
        price: 65,
        intro: '该本以"偏恋综"的形式展开，名为"七日纯爱之旅"，实则是一场深度爱情社会实验。注重高自由、强社交属性，拥有多种结局走向与支线剧情。文笔细腻，每个角色都有戳中人心的情感线...',
        cover: '/images/script-cover-5.png'
      },
      {
        id: 6,
        name: 'ROOM',
        type: '悬疑',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.9,
        playCount: 10200,
        isFree: false,
        price: 70,
        intro: '玩家将代入日式豪门家族的隐秘世界，在看似独立的案件调查中，揭开跨越数十年的家族纠葛与人性博弈。核心玩法是通过"基本演绎法"自由推理多个关联案件，在庞大的关系网中还原真相...',
        cover: '/images/script-cover-6.png'
      },
      {
        id: 7,
        name: '众念成形',
        type: '悬疑',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.4,
        playCount: 6780,
        isFree: false,
        price: 60,
        intro: '主打"中式民俗怪谈风格"，故事发生在偏远山村，围绕思念与挣扎展开。核心设定简单易懂且适配剧情，凶案手法精巧，以还原为主，依托长逻辑链实现反转，可玩性高...',
        cover: '/images/script-cover-7.png'
      },
      {
        id: 8,
        name: '佼佼中学冒险',
        type: '推理',
        difficulty: '中等',
        playerCount: 4,
        duration: 3,
        rating: 8.3,
        playCount: 9560,
        isFree: false,
        price: 65,
        intro: '夜晚来到佼佼中学的人们各怀目的：有人为冒险寻梦魇，有人为自杀，也有人为追杀初恋。众人在教学楼意外相遇，最终又有多少人能逃出生天……',
        cover: '/images/script-cover-8.png'
      },
      {
        id: 9,
        name: '十三间死亡失格',
        type: '推理',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.7,
        playCount: 11200,
        isFree: false,
        price: 70,
        intro: '夜晚来到佼佼中学的人们各怀目的：有人为冒险寻梦魇，有人为自杀，也有人为追杀初恋。众人在教学楼意外相遇，最终又有多少人能逃出生天……',
        cover: '/images/script-cover-1.png'
      },
      {
        id: 10,
        name: '我是大掌柜',
        type: '欢乐',
        difficulty: '简单',
        playerCount: 7,
        duration: 3,
        rating: 8.2,
        playCount: 9800,
        isFree: false,
        price: 55,
        intro: '恩科选才自古有之，文有科举，武有武举。盛世之下商肆林立，朝廷特开"商举"选拔经商俊才，而商举背后暗藏阴谋。有人拍肩示意，你可取代"天下第一富商"，开启一场商贾风云。',
        cover: '/images/script-cover-2.png'
      },
      {
        id: 11,
        name: '空想之笼',
        type: '推理',
        difficulty: '中等',
        playerCount: 7,
        duration: 4,
        rating: 8.6,
        playCount: 13400,
        isFree: false,
        price: 70,
        intro: '在名为【空想之笼】的神秘国度，几位异乡人被通灵之术召唤而来，他们共同的职业是——侦探（一个在空想之笼内不存在的职业）。',
        cover: '/images/script-cover-3.png'
      },
      {
        id: 12,
        name: '就像水消失在水中',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 3,
        rating: 8.8,
        playCount: 8200,
        isFree: false,
        price: 65,
        intro: '这是一个隔代故事，登场角色包括古稀老者、花季少女、命途多舛的80后等，看似无关却彼此羁绊。角色性格鲜活，有叛逆张狂又自卑的少女，也有被生活压弯脊背的成年人...',
        cover: '/images/script-cover-4.png'
      },
      {
        id: 13,
        name: '神不在的第四日',
        type: '推理',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.2,
        playCount: 15600,
        isFree: false,
        price: 70,
        intro: '《神不在的第四日》是一个架空世界观下，新本格、硬核诡计流推理作品。它拥有着绝无仅有的推理形式，多重解答与悖论的逻辑碰撞。是非常难得的高浓度诡计逻辑+纯种本格手法本...',
        cover: '/images/script-cover-5.png'
      },
      {
        id: 14,
        name: '一方烟火',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 3,
        rating: 8.5,
        playCount: 7200,
        isFree: false,
        price: 72,
        intro: '故事不长，也不难说，相识一场，爱而不得。总会有些人突然闯入你的生活中，给你留下一段经历，一席遗憾，一段故事，又毫无征兆的离开...',
        cover: '/images/script-cover-6.png'
      },
      {
        id: 15,
        name: '食尸鬼盛宴',
        type: '推理',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.4,
        playCount: 8900,
        isFree: false,
        price: 68,
        intro: '融合中世纪背景、现代科学与异端邪教的克苏鲁题材世界，包含玛雅文明、亚特兰蒂斯、埃及金字塔等多元文明设定，是设定系"食玩"本，画面感强但阅读量较大。',
        cover: '/images/script-cover-7.png'
      },
      {
        id: 16,
        name: '斑马还没睡',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 3,
        rating: 8.9,
        playCount: 12100,
        isFree: false,
        price: 68,
        intro: '该本以特殊病症"斑马症候群"为切入点，关键词为"仿生人和孤独"，讲述一段浪漫治愈的故事。需要进行故事还原、拼凑记忆，文笔细腻戳人，人物形象饱满立体...',
        cover: '/images/script-cover-8.png'
      },
      {
        id: 17,
        name: '继承者',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.7,
        playCount: 9100,
        isFree: false,
        price: 68,
        intro: '多线叙事精密交织，权谋、陈年旧事与情感漩涡层层递进。全员"复仇者"人设，包含家族使命、血色复仇、禁忌之恋等元素，高能反转不断...',
        cover: '/images/script-cover-1.png'
      },
      {
        id: 18,
        name: '我闻神仙亦有死',
        type: '古风',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.8,
        playCount: 14200,
        isFree: false,
        price: 78,
        intro: '以清嘉庆年间的宁舟城为背景，六扇门捕快奉命追捕妖道"待秋仙翁"，他连杀天师将军，手法诡谲。玩家扮演子鼠、寅虎等六名捕快，手握仅一页的核心设定，需破解从破冰小案到八卦连环案再到三连杀核诡的八个案件...',
        cover: '/images/script-cover-2.png'
      },
      {
        id: 19,
        name: '贪欢',
        type: '古风',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.0,
        playCount: 16700,
        isFree: false,
        price: 65,
        intro: '以架空古风王朝为背景，描绘皇权更迭与世家争斗下，一群"局中人"在盛世阴影里的爱恨纠葛。玩家将扮演皇子、公主、将军、质子等身份各异的角色，通过大量互动演绎与私密"小黑屋"环节...',
        cover: '/images/script-cover-3.png'
      },
      {
        id: 20,
        name: '不容',
        type: '古风',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 9.1,
        playCount: 18900,
        isFree: false,
        price: 69,
        intro: '以战争为背景，生逢乱世，命不由人，将每个人卷入复杂的情感纠葛和家国纷争之中。文笔优秀，人设新颖，NPC塑造有血有肉，结合抓马设定和不停反转，加入"错位成婚、纯爱恨陪"等元素，可玩性高...',
        cover: '/images/script-cover-4.png'
      },
      {
        id: 21,
        name: '赌王之王',
        type: '欢乐',
        difficulty: '困难',
        playerCount: 7,
        duration: 4,
        rating: 8.8,
        playCount: 17800,
        isFree: false,
        price: 67,
        intro: '以拉斯维加斯赌城为背景，七位赌徒为争夺"国际赌王"头衔与上亿奖金展开疯狂博弈。玩家将扮演赌坊常客（大刚/陈爷等角色），通过轮盘赌、梭哈、拍卖等十余种机制游戏积累财富...',
        cover: '/images/script-cover-5.png'
      },
      {
        id: 22,
        name: '青竹馆事件',
        type: '日式',
        difficulty: '中等',
        playerCount: 6,
        duration: 3,
        rating: 8.5,
        playCount: 9800,
        isFree: false,
        price: 59,
        intro: '玩家将扮演6位高中推理社成员，受邀前往青竹馆，见证竹中慎吾封笔之作的诞生，共同揭开尘封十五年的真相。',
        cover: '/images/script-cover-6.png'
      },
      {
        id: 23,
        name: '奇异人生2100',
        type: '科幻',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.1,
        playCount: 24300,
        isFree: false,
        price: 70,
        intro: '欢迎来到奇异人生游戏公司。玩家将进入第一人称VR游戏，体验2100年的赛博朋克世界。6位队员需要共同审判这个世界的一切：秩序、压迫、人工智能、爱、虚伪、自由、战争...',
        cover: '/images/script-cover-7.png'
      },
      {
        id: 24,
        name: '请阅读至100.1%',
        type: '推理',
        difficulty: '困难',
        playerCount: 7,
        duration: 4,
        rating: 8.9,
        playCount: 15600,
        isFree: false,
        price: 67,
        intro: '该本以"小说"这一写作载体切入推理，代入"作者"和"小说人物"的身份与视角感受"一句话反转"。采用POV网状叙事+长逻辑链+多重反转的形式，推理与还原占比为2:8。',
        cover: '/images/script-cover-8.png'
      },
      {
        id: 25,
        name: '45贰蕴神',
        type: '惊悚',
        difficulty: '困难',
        playerCount: 6,
        duration: 5,
        rating: 9.3,
        playCount: 28900,
        isFree: false,
        price: 77,
        intro: '以传说中的藏神村为舞台，六名受邀者踏入这个尘封已久的村落，探寻蜕凡成神的秘密。玩家将扮演梁锦绣、夏星河等角色，在4-6小时的沉浸体验中，通过50余张线索卡与声光电演绎，揭开历史长河中的悲剧真相...',
        cover: '/images/script-cover-1.png'
      },
      {
        id: 26,
        name: '祭日快乐',
        type: '惊悚',
        difficulty: '困难',
        playerCount: 6,
        duration: 5,
        rating: 9.2,
        playCount: 21500,
        isFree: false,
        price: 79,
        intro: '一场看似热闹的生日宴，六个心怀鬼胎的好友。亲情，爱情，执念…皆可成为献祭的筹码。这里没有纯粹的善意，只有精心编织的谎言与交易。当祝福变成诅咒，当愿望需要血偿...',
        cover: '/images/script-cover-2.png'
      },
      {
        id: 27,
        name: 'U',
        type: '推理',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.0,
        playCount: 19800,
        isFree: false,
        price: 68,
        intro: '一花一世界，一树一菩提。宇宙中漂浮的那些"世界"渺小如尘埃，它们或绚烂，或沉寂，或具象，或……当中子星再一次推开那间房间的门，已经是几个月之后的事情了...',
        cover: '/images/script-cover-3.png'
      },
      {
        id: 28,
        name: '体温',
        type: '情感',
        difficulty: '中等',
        playerCount: 6,
        duration: 6,
        rating: 8.7,
        playCount: 14500,
        isFree: false,
        price: 65,
        intro: '以现代修仙界"香坛会"为舞台，调香师们凭借独特香料操纵欲望、汲取灵力，玩家扮演六名天赋各异的参会者，在氤氲香气与心跳监测、制香破冰等新颖互动中，卷入一场关乎爱恨、权力与种族存续的隐秘战争...',
        cover: '/images/script-cover-4.png'
      },
      {
        id: 29,
        name: '草芥',
        type: '古风',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.6,
        playCount: 13200,
        isFree: false,
        price: 58,
        intro: '该本以"江湖武林+朝廷纷争"为双主线，讲述一群少年在动荡时代中的成长、抉择与坚守。文笔优秀细腻，既有江湖热血也有权谋责任，情感更是多线开花，有亲情、爱情、成长、群像，人物羁绊强...',
        cover: '/images/script-cover-5.png'
      },
      {
        id: 30,
        name: '我唯一忏悔的事',
        type: '暗黑',
        difficulty: '困难',
        playerCount: 6,
        duration: 6,
        rating: 9.4,
        playCount: 26700,
        isFree: false,
        price: 79,
        intro: '以架空吸血鬼世界为背景，讲述了一群被欲望、血缘与诅咒捆绑的灵魂，在科隆圣教堂内展开关于罪与罚的终极博弈。玩家将扮演六位身份各异的角色（如警监"北极"、诈骗师"十一月"等）...',
        cover: '/images/script-cover-6.png'
      }
    ],
    filteredScripts: [],
    showFilter: false,
    selectedDifficulty: '',
    selectedPlayerCount: '',
    priceType: 'all',
    loading: false,
    hasMore: true,
    page: 1
  },

  onLoad(options) {
    this.loadCurrentCity();
    this.filterScripts();
  },

  // 加载当前城市
  loadCurrentCity() {
    const currentCity = app.globalData.currentCity || '北京';
    this.setData({ currentCity });
  },

  // 显示城市选择器
  showCitySelector() {
    wx.showToast({
      title: '选择城市',
      icon: 'none'
    });
    // 可以在这里调用全局的城市选择器或跳转到城市选择页面
  },

  onShow() {
    // 每次显示页面时检查是否有新的搜索关键词
    const app = getApp();
    console.log('script-list onShow, 全局搜索关键词:', app.globalData.searchKeyword);
    console.log('当前页面搜索关键词:', this.data.searchKeyword);

    if (app.globalData.searchKeyword && app.globalData.searchKeyword !== this.data.searchKeyword) {
      const keyword = app.globalData.searchKeyword;
      console.log('执行搜索,关键词:', keyword);

      this.setData({
        searchKeyword: keyword
      });

      // 清除全局搜索关键词,避免重复搜索
      app.globalData.searchKeyword = '';
      // 执行筛选
      this.filterScripts();
      // 显示搜索提示
      wx.showToast({
        title: `已搜索"${keyword}"`,
        icon: 'none'
      });
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.filterScripts();
  },

  // 选择类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      activeType: type
    });
    this.filterScripts();
  },

  // 选择排序
  selectSort(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      activeSort: sort
    });
    this.filterScripts();
  },

  // 显示筛选弹窗
  showFilterModal() {
    this.setData({
      showFilter: true
    });
  },

  // 隐藏筛选弹窗
  hideFilterModal() {
    this.setData({
      showFilter: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 选择难度
  selectDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({
      selectedDifficulty: difficulty
    });
  },

  // 选择人数
  selectPlayerCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({
      selectedPlayerCount: count
    });
  },

  // 选择价格类型
  selectPriceType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      priceType: type
    });
  },

  // 重置筛选
  resetFilter() {
    this.setData({
      selectedDifficulty: '',
      selectedPlayerCount: '',
      priceType: 'all'
    });
  },

  // 应用筛选
  applyFilter() {
    this.filterScripts();
    this.hideFilterModal();
  },

  // 筛选剧本
  filterScripts() {
    let filtered = [...this.data.scripts];

    // 搜索关键词筛选
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(script =>
        script.name.toLowerCase().includes(keyword) ||
        script.intro.toLowerCase().includes(keyword)
      );
    }

    // 类型筛选
    if (this.data.activeType !== 'all') {
      filtered = filtered.filter(script => script.type === this.data.activeType);
    }

    // 难度筛选
    if (this.data.selectedDifficulty) {
      filtered = filtered.filter(script => script.difficulty === this.data.selectedDifficulty);
    }

    // 人数筛选
    if (this.data.selectedPlayerCount) {
      const countRange = this.data.selectedPlayerCount;
      if (countRange === '3-4') {
        filtered = filtered.filter(script => script.playerCount >= 3 && script.playerCount <= 4);
      } else if (countRange === '5-6') {
        filtered = filtered.filter(script => script.playerCount >= 5 && script.playerCount <= 6);
      } else if (countRange === '7+') {
        filtered = filtered.filter(script => script.playerCount >= 7);
      }
    }

    // 价格筛选
    if (this.data.priceType === 'free') {
      filtered = filtered.filter(script => script.isFree);
    } else if (this.data.priceType === 'paid') {
      filtered = filtered.filter(script => !script.isFree);
    }

    // 排序
    if (this.data.activeSort === 'hot') {
      filtered.sort((a, b) => b.playCount - a.playCount);
    } else if (this.data.activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (this.data.activeSort === 'newest') {
      filtered.reverse();
    } else if (this.data.activeSort === 'players') {
      filtered.sort((a, b) => a.playerCount - b.playerCount);
    }

    this.setData({
      filteredScripts: filtered
    });
  },

  // 加载更多
  loadMoreScripts() {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ loading: true });

    // 模拟加载更多数据
    setTimeout(() => {
      // 实际项目中这里应该调用API获取更多数据
      this.setData({
        loading: false,
        hasMore: false
      });
    }, 1000);
  },

  // 查看剧本详情
  viewScriptDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/script-detail/script-detail?id=${id}`
    });
  }
})
