// pages/script-detail/script-detail.js
Page({
  data: {
    scriptId: null,
    script: {},
    isCollected: false,
    filterType: 'all',
    filteredReviews: [],
    carpoolRecords: [],
    statusBarHeight: 44,
    navBarHeight: 44
  },

  onLoad(options) {
    const scriptId = options.id;
    this.setData({ scriptId });
    this.loadScriptDetail(scriptId);
    this.loadCarpoolRecords(scriptId);
    this.checkCollectStatus();
    this.getSystemInfo();
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    // 计算导航栏高度
    const navBarHeight = menuButtonInfo.top + menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight);

    this.setData({
      statusBarHeight,
      navBarHeight
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 加载剧本详情
  loadScriptDetail(id) {
    // 模拟剧本详情数据
    const scriptDetails = {
      1: {
        id: 1,
        name: '下课后',
        type: '日式',
        difficulty: '困难',
        playerCount: 4,
        duration: 4,
        rating: 9.0,
        playCount: 12580,
        roomCount: 328,
        isFree: false,
        price: 75,
        cover: '/images/script-cover-1.png',
        intro: '时茉女校以内设学生风纪部自治闻名。近日，该校组织了一场《夜莺与玫瑰》的话剧表演。而就在演出当天，主角如同故事里般走向了悲剧……',
        story: '时茉女校是一所历史悠久的女子学校，学生风纪部自治体系严密。校方组织了一场《夜莺与玫瑰》的话剧表演，全校师生都沉浸在这场浪漫的演出中。然而，就在演出当天，饰演夜莺的女学生如同故事中一般走向了悲剧。四位与案件相关的人员被召集起来，他们每个人都有自己的秘密和动机。这看似是一场意外，还是精心策划的谋杀？在校园的每一个角落，都隐藏着不为人知的真相。',
        characters: [
          { name: '风纪部部长', gender: '不限', desc: '严厉而完美' },
          { name: '话剧社社长', gender: '女', desc: '饰演夜莺' },
          { name: '话剧指导', gender: '男', desc: '校外来的指导' },
          { name: '被害者好友', gender: '不限', desc: '知道很多秘密' }
        ],
        features: [
          '日式/推理题材',
          '严密的逻辑推理',
          '沉浸式校园体验',
          '适合喜欢日式推理的玩家'
        ],
        suitable: '适合喜欢日式推理、校园题材的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本涉及校园题材，请尊重角色设定。请认真对待每一个线索。',
        reviews: [
          {
            id: 1,
            nickname: '日式推理控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '超级棒的日式校园本！氛围营造得特别好，结局反转太精彩了！',
            time: '2天前',
            tags: ['氛围好', '反转精彩', '日式']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '逻辑严密，线索设计得很巧妙。校园背景很吸引人。',
            time: '5天前',
            tags: ['逻辑好', '线索丰富']
          },
          {
            id: 3,
            nickname: '新手玩家',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩日式本，体验感很好！剧情紧凑，不会无聊~',
            time: '1周前',
            tags: ['新手友好', '有趣']
          }
        ]
      },
      2: {
        id: 2,
        name: '皮囊',
        type: '情感',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.8,
        playCount: 23450,
        roomCount: 562,
        isFree: false,
        price: 85,
        cover: '/images/script-cover-2.png',
        intro: 'A本以还原为主，玩家需通过线索卡和记忆片段梳理案发当晚的时间线，初步勾勒出人物关系网。此时你会发现，所有人似乎都与一对名为"春"和"冬"的姐妹有千丝万缕的联系。进入B本后，故事转向更深层的情感过往。',
        story: 'A本以还原为主，玩家需通过线索卡和记忆片段梳理案发当晚的时间线，初步勾勒出人物关系网。此时你会发现，所有人似乎都与一对名为"春"和"冬"的姐妹有千丝万缕的联系。进入B本后，故事转向更深层的情感过往。春和冬的相依为命逐渐浮出水面。这时，第一个反转到来：你以为的受害者可能才是加害者，而看似癫狂的人却在默默守护。玩家需要拼凑出每个人"皮囊"下的真实欲望。',
        characters: [
          { name: '春', gender: '女', desc: '温暖如阳，冬的姐姐' },
          { name: '冬', gender: '女', desc: '冷若冰霜，春的妹妹' },
          { name: '男性角色1', gender: '男', desc: '与姐妹相关的人物' },
          { name: '男性角色2', gender: '男', desc: '与姐妹相关的人物' },
          { name: '男性角色3', gender: '男', desc: '与姐妹相关的人物' },
          { name: '其他角色', gender: '不限', desc: '与姐妹相关的人物' }
        ],
        features: [
          '情感｜都市题材',
          'A本还原，B本情感',
          '多重反转，情感深刻',
          '适合喜欢情感本的玩家'
        ],
        suitable: '适合喜欢情感纠葛、注重角色塑造的玩家。建议喜欢沉浸式体验的玩家参加。',
        notice: '本剧本情感浓度较高，请做好心理准备。请投入角色，体验情感共鸣。',
        reviews: [
          {
            id: 1,
            nickname: '情感本爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '太感人了！姐妹情刻画得很深刻，哭了好几次~',
            time: '3天前',
            tags: ['感人', '姐妹情', '情感']
          },
          {
            id: 2,
            nickname: '推理玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: 'A本推理部分很扎实，B本情感部分很戳人。整体体验很好！',
            time: '1周前',
            tags: ['推理好', '情感强', '推荐']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩情感本，真的被感动了！队友们都投入了角色~',
            time: '2周前',
            tags: ['新手友好', '感人', '体验好']
          }
        ]
      },
      3: {
        id: 3,
        name: '醉凌云',
        type: '古风',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.7,
        playCount: 8920,
        roomCount: 218,
        isFree: false,
        price: 75,
        cover: '/images/script-cover-3.png',
        intro: '随着剧情推进，人物关系网逐渐清晰。白未染与痁神殿高手巫弦乐之间展开正邪对立的激烈碰撞，彼此折磨又相互吸引。苏温言与冷寂在身份落差中尝试双向奔赴。苏浅语与方逆在每一次真实的杀意与无奈的妥协中纠缠。慕归则深陷对冷刃的复杂情感，在委屈与坚定中选择。',
        story: '随着剧情推进，人物关系网逐渐清晰。白未染与痁神殿高手巫弦乐之间展开正邪对立的激烈碰撞，彼此折磨又相互吸引。苏温言与冷寂在身份落差中尝试双向奔赴。苏浅语与方逆在每一次真实的杀意与无奈的妥协中纠缠。慕归则深陷对冷刃的复杂情感，在委屈与坚定中选择。个人情感与家族责任、江湖道义产生剧烈冲突。',
        characters: [
          { name: '白未染', gender: '女', desc: '正派弟子' },
          { name: '巫弦乐', gender: '男', desc: '痁神殿高手' },
          { name: '苏温言', gender: '男', desc: '正派弟子' },
          { name: '冷寂', gender: '女', desc: '神秘人物' },
          { name: '苏浅语', gender: '女', desc: '天真少女' },
          { name: '方逆', gender: '男', desc: '身负重担' }
        ],
        features: [
          '情感｜古风｜热血江湖',
          '正邪对立，情感纠葛',
          '个人情感与江湖道义冲突',
          '适合喜欢古风热血的玩家'
        ],
        suitable: '适合喜欢古风言情、正邪对立题材的玩家。建议喜欢感情戏的玩家参加。',
        notice: '本剧本情感纠葛复杂，请投入角色体验正邪立场的碰撞。',
        reviews: [
          {
            id: 1,
            nickname: '古风言情控',
            avatar: '/images/avatar7.png',
            rating: 5,
            content: '太好嗑了！正邪对立的CP感太强了！',
            time: '1天前',
            tags: ['言情', 'CP', '古风']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar8.png',
            rating: 4,
            content: '正邪对立的设定很有张力，多线感情很精彩~',
            time: '4天前',
            tags: ['正邪对立', '多线感情']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar9.png',
            rating: 5,
            content: '第一次玩古风言情本，体验感很好！热血江湖太燃了~',
            time: '1周前',
            tags: ['新手友好', '热血', '推荐']
          }
        ]
      },
      4: {
        id: 4,
        name: '归唐',
        type: '古风',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.6,
        playCount: 15630,
        roomCount: 312,
        isFree: false,
        price: 65,
        cover: '/images/script-cover-4.png',
        intro: '在压抑的现实间隙，一次"夜游长安"的沉浸演绎成为全剧最浪漫的转折。你们仿佛真的穿越到了盛世长安，见到了亭台楼阁，尝到了羊肉汤，感受到了何为"大唐"。这个共同的梦境，让"归唐"从一个模糊的口号，变成了所有人愿意为之赴死的具体向往。',
        story: '在压抑的现实间隙，一次"夜游长安"的沉浸演绎成为全剧最浪漫的转折。你们仿佛真的穿越到了盛世长安，见到了亭台楼阁，尝到了羊肉汤，感受到了何为"大唐"。这个共同的梦境，让"归唐"从一个模糊的口号，变成了所有人愿意为之赴死的具体向往。与此同时，个人情感也在悄悄滋长，爱情、亲情、师徒情在时代洪流中显得尤为珍贵又脆弱。',
        characters: [
          { name: '玩家1', gender: '不限', desc: '现代穿越者' },
          { name: '玩家2', gender: '不限', desc: '现代穿越者' },
          { name: '玩家3', gender: '不限', desc: '现代穿越者' },
          { name: '玩家4', gender: '不限', desc: '现代穿越者' },
          { name: '玩家5', gender: '不限', desc: '现代穿越者' },
          { name: '玩家6', gender: '不限', desc: '现代穿越者' }
        ],
        features: [
          '情感｜古风题材',
          '沉浸式长安体验',
          '浪漫演绎，氛围感强',
          '适合喜欢古风情感的玩家'
        ],
        suitable: '适合喜欢古风、历史题材、沉浸式体验的玩家。新手友好，适合聚会。',
        notice: '本剧本适合沉浸式体验，请融入角色，感受盛唐风华。',
        reviews: [
          {
            id: 1,
            nickname: '古风控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '太喜欢这个本的长安设定了！仿佛真的穿越到了盛唐！',
            time: '2天前',
            tags: ['古风', '长安', '沉浸']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '情感刻画很到位，长安的浪漫氛围很赞~',
            time: '5天前',
            tags: ['情感', '长安', '浪漫']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩古风本，体验感超好！长安的氛围太赞了~',
            time: '1周前',
            tags: ['新手友好', '长安', '推荐']
          }
        ]
      },
      5: {
        id: 5,
        name: '爱玫',
        type: '欧式',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.5,
        playCount: 7890,
        roomCount: 198,
        isFree: false,
        price: 65,
        cover: '/images/script-cover-5.png',
        intro: '该本以"偏恋综"的形式展开，名为"七日纯爱之旅"，实则是一场深度爱情社会实验。注重高自由、强社交属性，拥有多种结局走向与支线剧情。文笔细腻，每个角色都有戳中人心的情感线。',
        story: '该本以"偏恋综"的形式展开，名为"七日纯爱之旅"，实则是一场深度爱情社会实验。注重高自由、强社交属性，拥有多种结局走向与支线剧情。文笔细腻，每个角色都有戳中人心的情感线，同时具备思辨性，能引发"爱是什么"的讨论与思考。故事发生在与世隔绝的奢华岛屿——爱玫岛，六位被精心筛选的参与者收到神秘邀请，前来体验一场名为"爱玫七日纯爱之旅"的独家沙龙。',
        characters: [
          { name: '参与者1', gender: '不限', desc: '被精心筛选的参与者' },
          { name: '参与者2', gender: '不限', desc: '被精心筛选的参与者' },
          { name: '参与者3', gender: '不限', desc: '被精心筛选的参与者' },
          { name: '参与者4', gender: '不限', desc: '被精心筛选的参与者' },
          { name: '参与者5', gender: '不限', desc: '被精心筛选的参与者' },
          { name: '参与者6', gender: '不限', desc: '被精心筛选的参与者' }
        ],
        features: [
          '欧美｜情感｜架空',
          '恋综题材，高自由度',
          '强社交属性，情感线丰富',
          '适合喜欢恋爱社交的玩家'
        ],
        suitable: '适合喜欢恋爱题材、高自由社交的玩家。新手友好，适合聚会。',
        notice: '本剧本适合角色扮演体验，请主动社交，发展情感线。',
        reviews: [
          {
            id: 1,
            nickname: '恋综爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '太浪漫了！恋综设定很新鲜，结局走向很自由~',
            time: '3天前',
            tags: ['恋综', '浪漫', '自由']
          },
          {
            id: 2,
            nickname: '社交达人',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '社交属性很强，每个角色都有发展空间！',
            time: '1周前',
            tags: ['社交', '自由', '推荐']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩恋综本，体验感很好！很轻松有趣~',
            time: '2周前',
            tags: ['新手友好', '恋综', '有趣']
          }
        ]
      },
      6: {
        id: 6,
        name: 'ROOM',
        type: '悬疑',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.9,
        playCount: 10200,
        roomCount: 256,
        isFree: false,
        price: 70,
        cover: '/images/script-cover-6.png',
        intro: '玩家将代入日式豪门家族的隐秘世界，在看似独立的案件调查中，揭开跨越数十年的家族纠葛与人性博弈。核心玩法是通过"基本演绎法"自由推理多个关联案件，在庞大的关系网中还原真相。',
        story: '玩家将代入日式豪门家族的隐秘世界，在看似独立的案件调查中，揭开跨越数十年的家族纠葛与人性博弈。核心玩法是通过"基本演绎法"自由推理多个关联案件，在庞大的关系网中还原真相，经历多次身份与故事反转，最终在社会派反思中完成闭环。',
        characters: [
          { name: '家族成员1', gender: '不限', desc: '日式豪门家族成员' },
          { name: '家族成员2', gender: '不限', desc: '日式豪门家族成员' },
          { name: '家族成员3', gender: '不限', desc: '日式豪门家族成员' },
          { name: '家族成员4', gender: '不限', desc: '日式豪门家族成员' },
          { name: '家族成员5', gender: '不限', desc: '日式豪门家族成员' },
          { name: '家族成员6', gender: '不限', desc: '日式豪门家族成员' }
        ],
        features: [
          '悬疑｜日式题材',
          '基本演绎法推理',
          '多案件关联，反转不断',
          '适合喜欢推理悬疑的玩家'
        ],
        suitable: '适合喜欢推理、家族纠葛题材的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本注重推理，请认真梳理线索，理清人物关系。',
        reviews: [
          {
            id: 1,
            nickname: '推理达人',
            avatar: '/images/avatar7.png',
            rating: 5,
            content: '基本演绎法推理很有趣！多个案件关联设计得很好！',
            time: '1天前',
            tags: ['推理', '演绎法', '家族']
          },
          {
            id: 2,
            nickname: '悬疑爱好者',
            avatar: '/images/avatar8.png',
            rating: 4,
            content: '家族纠葛很精彩，逻辑严密，推理体验很好~',
            time: '4天前',
            tags: ['悬疑', '家族', '逻辑']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar9.png',
            rating: 5,
            content: '第一次玩这种多案件关联的本，很有成就感！',
            time: '1周前',
            tags: ['新手友好', '推理', '推荐']
          }
        ]
      },
      7: {
        id: 7,
        name: '众念成形',
        type: '悬疑',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.4,
        playCount: 6780,
        roomCount: 169,
        isFree: false,
        price: 60,
        cover: '/images/script-cover-7.png',
        intro: '主打"中式民俗怪谈风格"，故事发生在偏远山村，围绕思念与挣扎展开。核心设定简单易懂且适配剧情，凶案手法精巧，以还原为主，依托长逻辑链实现反转，可玩性高。',
        story: '主打"中式民俗怪谈风格"，故事发生在偏远山村，围绕思念与挣扎展开。核心设定简单易懂且适配剧情，凶案手法精巧，以还原为主，依托长逻辑链实现反转，可玩性高。情感与推理相辅相成，后劲十足。',
        characters: [
          { name: '村民1', gender: '不限', desc: '偏远山村村民' },
          { name: '村民2', gender: '不限', desc: '偏远山村村民' },
          { name: '村民3', gender: '不限', desc: '偏远山村村民' },
          { name: '村民4', gender: '不限', desc: '偏远山村村民' },
          { name: '村民5', gender: '不限', desc: '偏远山村村民' },
          { name: '村民6', gender: '不限', desc: '偏远山村村民' }
        ],
        features: [
          '中式｜怪谈题材',
          '民俗怪谈风格',
          '凶案手法精巧，长逻辑链',
          '适合喜欢民俗怪谈的玩家'
        ],
        suitable: '适合喜欢中式民俗怪谈、推理还原的玩家。新手友好，适合聚会。',
        notice: '本剧本含有民俗元素，请尊重民间传说。请认真梳理长逻辑链。',
        reviews: [
          {
            id: 1,
            nickname: '民俗爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '民俗怪谈氛围很棒！核心设定很有趣！',
            time: '2天前',
            tags: ['民俗', '怪谈', '氛围']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '长逻辑链反转设计得很好，推理体验很好！',
            time: '5天前',
            tags: ['推理', '反转', '逻辑']
          },
          {
            id: 3,
            nickname: '新手玩家',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩民俗本，体验感很好！氛围营造得很棒~',
            time: '1周前',
            tags: ['新手友好', '民俗', '推荐']
          }
        ]
      },
      8: {
        id: 8,
        name: '佼佼中学冒险',
        type: '推理',
        difficulty: '中等',
        playerCount: 4,
        duration: 3,
        rating: 8.3,
        playCount: 9560,
        roomCount: 239,
        isFree: false,
        price: 65,
        cover: '/images/script-cover-8.png',
        intro: '夜晚来到佼佼中学的人们各怀目的：有人为冒险寻梦魇，有人为自杀，也有人为追杀初恋。众人在教学楼意外相遇，最终又有多少人能逃出生天……',
        story: '夜晚来到佼佼中学的人们各怀目的：有人为冒险寻梦魇，有人为自杀，也有人为追杀初恋。众人在教学楼意外相遇，最终又有多少人能逃出生天……',
        characters: [
          { name: '玩家1', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家2', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家3', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家4', gender: '不限', desc: '夜晚来到学校的人' }
        ],
        features: [
          '推理｜校园冒险',
          '各怀目的，秘密交织',
          '逃脱元素，紧张刺激',
          '适合喜欢校园推理的玩家'
        ],
        suitable: '适合喜欢校园题材、悬疑逃脱的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本含有逃脱元素，请注意时间限制。请认真对待每个线索。',
        reviews: [
          {
            id: 1,
            nickname: '校园推理控',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '校园冒险题材很吸引人！逃脱设计很刺激！',
            time: '3天前',
            tags: ['校园', '冒险', '逃脱']
          },
          {
            id: 2,
            nickname: '悬疑爱好者',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '秘密交织设计得很好，紧张刺激！',
            time: '1周前',
            tags: ['悬疑', '秘密', '刺激']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩校园逃脱本，体验感很好！很刺激~',
            time: '2周前',
            tags: ['新手友好', '逃脱', '刺激']
          }
        ]
      },
      9: {
        id: 9,
        name: '十三间死亡失格',
        type: '推理',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.7,
        playCount: 11200,
        roomCount: 280,
        isFree: false,
        price: 70,
        cover: '/images/script-cover-1.png',
        intro: '夜晚来到佼佼中学的人们各怀目的：有人为冒险寻梦魇，有人为自杀，也有人为追杀初恋。众人在教学楼意外相遇，最终又有多少人能逃出生天……',
        story: '夜晚来到佼佼中学的人们各怀目的：有人为冒险寻梦魇，有人为自杀，也有人为追杀初恋。众人在教学楼意外相遇，最终又有多少人能逃出生天……',
        characters: [
          { name: '玩家1', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家2', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家3', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家4', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家5', gender: '不限', desc: '夜晚来到学校的人' },
          { name: '玩家6', gender: '不限', desc: '夜晚来到学校的人' }
        ],
        features: [
          '推理｜悬疑题材',
          '校园设定，氛围浓厚',
          '逃脱与推理结合',
          '适合喜欢推理悬疑的玩家'
        ],
        suitable: '适合喜欢校园推理、多房间解谜的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本涉及哲学思考，请认真对待每个线索。',
        reviews: [
          {
            id: 1,
            nickname: '解谜爱好者',
            avatar: '/images/avatar7.png',
            rating: 5,
            content: '推理悬疑设计得很巧妙！氛围很赞！',
            time: '1天前',
            tags: ['解谜', '悬疑', '校园']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar8.png',
            rating: 4,
            content: '校园设定很有深度，推理体验很好！',
            time: '4天前',
            tags: ['推理', '悬疑', '深度']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar9.png',
            rating: 5,
            content: '第一次玩推理悬疑本，体验感很好！',
            time: '1周前',
            tags: ['新手友好', '推理', '推荐']
          }
        ]
      },
      10: {
        id: 10,
        name: '我是大掌柜',
        type: '欢乐',
        difficulty: '简单',
        playerCount: 7,
        duration: 3,
        rating: 8.2,
        playCount: 9800,
        roomCount: 245,
        isFree: false,
        price: 55,
        cover: '/images/script-cover-2.png',
        intro: '恩科选才自古有之，文有科举，武有武举。盛世之下商肆林立，朝廷特开"商举"选拔经商俊才，而商举背后暗藏阴谋。有人拍肩示意，你可取代"天下第一富商"，开启一场商贾风云。',
        story: '恩科选才自古有之，文有科举，武有武举。盛世之下商肆林立，朝廷特开"商举"选拔经商俊才，而商举背后暗藏阴谋。有人拍肩示意，你可取代"天下第一富商"，开启一场商贾风云。',
        characters: [
          { name: '掌柜1', gender: '不限', desc: '参赛商人' },
          { name: '掌柜2', gender: '不限', desc: '参赛商人' },
          { name: '掌柜3', gender: '不限', desc: '参赛商人' },
          { name: '掌柜4', gender: '不限', desc: '参赛商人' },
          { name: '掌柜5', gender: '不限', desc: '参赛商人' },
          { name: '掌柜6', gender: '不限', desc: '参赛商人' },
          { name: '掌柜7', gender: '不限', desc: '参赛商人' }
        ],
        features: [
          '欢乐｜古风题材',
          '商贾风云，机制丰富',
          '欢乐竞争，轻松有趣',
          '适合喜欢欢乐机制的玩家'
        ],
        suitable: '适合喜欢欢乐、机制、竞争题材的玩家。新手友好，适合聚会。',
        notice: '本剧本机制丰富，请认真阅读规则。欢乐氛围，请尽情享受游戏。',
        reviews: [
          {
            id: 1,
            nickname: '机制本爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '商贾题材很新鲜！机制设计很有趣！',
            time: '2天前',
            tags: ['机制', '欢乐', '商贾']
          },
          {
            id: 2,
            nickname: '欢乐玩家',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '机制各具特色，竞争很激烈！',
            time: '5天前',
            tags: ['欢乐', '竞争', '机制']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩商贾本，体验感很好！很欢乐~',
            time: '1周前',
            tags: ['新手友好', '欢乐', '推荐']
          }
        ]
      },
      11: {
        id: 11,
        name: '空想之笼',
        type: '推理',
        difficulty: '中等',
        playerCount: 7,
        duration: 4,
        rating: 8.6,
        playCount: 13400,
        roomCount: 335,
        isFree: false,
        price: 70,
        cover: '/images/script-cover-3.png',
        intro: '在名为【空想之笼】的神秘国度，几位异乡人被通灵之术召唤而来，他们共同的职业是——侦探（一个在空想之笼内不存在的职业）。',
        story: '在名为【空想之笼】的神秘国度，几位异乡人被通灵之术召唤而来，他们共同的职业是——侦探（一个在空想之笼内不存在的职业）。在这个充满幻想与现实交织的世界中，侦探们需要运用自己的智慧，揭开层层谜团，找到回家的路。',
        characters: [
          { name: '侦探1', gender: '不限', desc: '被召唤的侦探' },
          { name: '侦探2', gender: '不限', desc: '被召唤的侦探' },
          { name: '侦探3', gender: '不限', desc: '被召唤的侦探' },
          { name: '侦探4', gender: '不限', desc: '被召唤的侦探' },
          { name: '侦探5', gender: '不限', desc: '被召唤的侦探' },
          { name: '侦探6', gender: '不限', desc: '被召唤的侦探' },
          { name: '侦探7', gender: '不限', desc: '被召唤的侦探' }
        ],
        features: [
          '推理｜幻想题材',
          '架空世界观',
          '侦探题材，逻辑推理',
          '适合喜欢幻想推理的玩家'
        ],
        suitable: '适合喜欢幻想题材、逻辑推理的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本逻辑严密，请认真分析每个线索。',
        reviews: [
          {
            id: 1,
            nickname: '幻想推理控',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '架空世界观设定很有趣！侦探题材很吸引人！',
            time: '3天前',
            tags: ['幻想', '推理', '有趣']
          },
          {
            id: 2,
            nickname: '逻辑玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '逻辑推理设计得很好，很烧脑~',
            time: '1周前',
            tags: ['逻辑', '推理', '烧脑']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩幻想本，体验感很好！世界观很棒~',
            time: '2周前',
            tags: ['新手友好', '幻想', '推荐']
          }
        ]
      },
      12: {
        id: 12,
        name: '就像水消失在水中',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 3,
        rating: 8.8,
        playCount: 8200,
        roomCount: 205,
        isFree: false,
        price: 65,
        cover: '/images/script-cover-4.png',
        intro: '这是一个隔代故事，登场角色包括古稀老者、花季少女、命途多舛的80后等，看似无关却彼此羁绊。角色性格鲜活，有叛逆张狂又自卑的少女，也有被生活压弯脊背的成年人。',
        story: '这是一个隔代故事，登场角色包括古稀老者、花季少女、命途多舛的80后等，看似无关却彼此羁绊。角色性格鲜活，有叛逆张狂又自卑的少女，也有被生活压弯脊背的成年人。每个人都有自己的故事，每个人的命运都交织在一起。',
        characters: [
          { name: '古稀老者', gender: '不限', desc: '70多岁的老人' },
          { name: '花季少女', gender: '女', desc: '叛逆又自卑' },
          { name: '80后', gender: '不限', desc: '命途多舛' },
          { name: '其他角色1', gender: '不限', desc: '故事中的人物' },
          { name: '其他角色2', gender: '不限', desc: '故事中的人物' },
          { name: '其他角色3', gender: '不限', desc: '故事中的人物' }
        ],
        features: [
          '情感｜隔代故事',
          '人物性格鲜活',
          '命运交织，情感深刻',
          '适合喜欢情感本的玩家'
        ],
        suitable: '适合喜欢情感题材、人物故事的玩家。建议喜欢沉浸式体验的玩家参加。',
        notice: '本剧本情感浓度较高，请做好心理准备。请投入角色，体验情感共鸣。',
        reviews: [
          {
            id: 1,
            nickname: '情感本爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '隔代故事设计得很巧妙！人物刻画很深刻！',
            time: '2天前',
            tags: ['情感', '隔代', '深刻']
          },
          {
            id: 2,
            nickname: '故事控',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '人物性格很鲜活，情感刻画很到位~',
            time: '5天前',
            tags: ['人物', '情感', '推荐']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩隔代故事本，体验感很好！很感动~',
            time: '1周前',
            tags: ['新手友好', '情感', '推荐']
          }
        ]
      },
      13: {
        id: 13,
        name: '神不在的第四日',
        type: '推理',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.2,
        playCount: 15600,
        roomCount: 390,
        isFree: false,
        price: 70,
        cover: '/images/script-cover-5.png',
        intro: '《神不在的第四日》是一个架空世界观下，新本格、硬核诡计流推理作品。它拥有着绝无仅有的推理形式，多重解答与悖论的逻辑碰撞。是非常难得的高浓度诡计逻辑+纯种本格手法本。',
        story: '《神不在的第四日》是一个架空世界观下，新本格、硬核诡计流推理作品。它拥有着绝无仅有的推理形式，多重解答与悖论的逻辑碰撞。是非常难得的高浓度诡计逻辑+纯种本格手法本。在一个没有神的世界里，玩家需要通过逻辑推理，揭开真相。',
        characters: [
          { name: '玩家1', gender: '不限', desc: '推理者' },
          { name: '玩家2', gender: '不限', desc: '推理者' },
          { name: '玩家3', gender: '不限', desc: '推理者' },
          { name: '玩家4', gender: '不限', desc: '推理者' },
          { name: '玩家5', gender: '不限', desc: '推理者' },
          { name: '玩家6', gender: '不限', desc: '推理者' }
        ],
        features: [
          '推理｜硬核诡计',
          '新本格手法',
          '多重解答，悖论碰撞',
          '适合喜欢硬核推理的玩家'
        ],
        suitable: '适合喜欢硬核推理、新本格手法的玩家。建议有丰富推理经验的玩家参加。',
        notice: '本剧本推理难度较高，请耐心分析。请认真对待每个线索。',
        reviews: [
          {
            id: 1,
            nickname: '硬核推理控',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '硬核诡计流！多重解答设计得太精彩了！',
            time: '3天前',
            tags: ['硬核', '诡计', '精彩']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '新本格手法很棒，悖论碰撞很烧脑~',
            time: '1周前',
            tags: ['新本格', '悖论', '烧脑']
          },
          {
            id: 3,
            nickname: '推理高手',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩这种高浓度诡计本，成就感爆棚！',
            time: '2周前',
            tags: ['硬核', '成就', '推荐']
          }
        ]
      },
      14: {
        id: 14,
        name: '一方烟火',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 3,
        rating: 8.5,
        playCount: 7200,
        roomCount: 180,
        isFree: false,
        price: 72,
        cover: '/images/script-cover-6.png',
        intro: '故事不长，也不难说，相识一场，爱而不得。总会有些人突然闯入你的生活中，给你留下一段经历，一席遗憾，一段故事，又毫无征兆的离开。',
        story: '故事不长，也不难说，相识一场，爱而不得。总会有些人突然闯入你的生活中，给你留下一段经历，一席遗憾，一段故事，又毫无征兆的离开。这就是青春，这就是人生，这就是我们。',
        characters: [
          { name: '玩家1', gender: '不限', desc: '故事中的人物' },
          { name: '玩家2', gender: '不限', desc: '故事中的人物' },
          { name: '玩家3', gender: '不限', desc: '故事中的人物' },
          { name: '玩家4', gender: '不限', desc: '故事中的人物' },
          { name: '玩家5', gender: '不限', desc: '故事中的人物' },
          { name: '玩家6', gender: '不限', desc: '故事中的人物' }
        ],
        features: [
          '情感｜青春题材',
          '爱而不得',
          '青春遗憾，情感深刻',
          '适合喜欢情感本的玩家'
        ],
        suitable: '适合喜欢青春情感题材的玩家。新手友好，适合聚会。',
        notice: '本剧本情感浓度较高，请做好心理准备。请投入角色，体验青春回忆。',
        reviews: [
          {
            id: 1,
            nickname: '情感本爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '青春遗憾太戳人了！爱而不得的感觉很真实！',
            time: '2天前',
            tags: ['情感', '青春', '遗憾']
          },
          {
            id: 2,
            nickname: '故事控',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '故事很简短但很深刻，情感描写很到位~',
            time: '5天前',
            tags: ['故事', '情感', '深刻']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩情感本，被感动了！青春回忆~',
            time: '1周前',
            tags: ['新手友好', '情感', '推荐']
          }
        ]
      },
      15: {
        id: 15,
        name: '食尸鬼盛宴',
        type: '推理',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.4,
        playCount: 8900,
        roomCount: 222,
        isFree: false,
        price: 68,
        cover: '/images/script-cover-7.png',
        intro: '融合中世纪背景、现代科学与异端邪教的克苏鲁题材世界，包含玛雅文明、亚特兰蒂斯、埃及金字塔等多元文明设定，是设定系"食玩"本，画面感强但阅读量较大。',
        story: '融合中世纪背景、现代科学与异端邪教的克苏鲁题材世界，包含玛雅文明、亚特兰蒂斯、埃及金字塔等多元文明设定，是设定系"食玩"本，画面感强但阅读量较大。玩家将进入一个充满神秘和未知的世界，揭开隐藏在文明背后的秘密。',
        characters: [
          { name: '探险者1', gender: '不限', desc: '文明探索者' },
          { name: '探险者2', gender: '不限', desc: '文明探索者' },
          { name: '探险者3', gender: '不限', desc: '文明探索者' },
          { name: '探险者4', gender: '不限', desc: '文明探索者' },
          { name: '探险者5', gender: '不限', desc: '文明探索者' },
          { name: '探险者6', gender: '不限', desc: '文明探索者' }
        ],
        features: [
          '推理｜克苏鲁题材',
          '多元文明设定',
          '设定系，画面感强',
          '适合喜欢克苏鲁的玩家'
        ],
        suitable: '适合喜欢克苏鲁、多元文明题材的玩家。建议有一定阅读能力的玩家参加。',
        notice: '本剧本阅读量较大，请耐心阅读。请认真理解设定。',
        reviews: [
          {
            id: 1,
            nickname: '克苏鲁爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '克苏鲁题材很吸引人！多元文明设定很棒！',
            time: '3天前',
            tags: ['克苏鲁', '文明', '设定']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '设定系本很有趣，画面感很强~',
            time: '1周前',
            tags: ['设定', '画面', '有趣']
          },
          {
            id: 3,
            nickname: '探险爱好者',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩克苏鲁本，体验感很好！世界观很震撼~',
            time: '2周前',
            tags: ['克苏鲁', '探险', '推荐']
          }
        ]
      },
      16: {
        id: 16,
        name: '斑马还没睡',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 3,
        rating: 8.9,
        playCount: 12100,
        roomCount: 302,
        isFree: false,
        price: 68,
        cover: '/images/script-cover-8.png',
        intro: '该本以特殊病症"斑马症候群"为切入点，关键词为"仿生人和孤独"，讲述一段浪漫治愈的故事。需要进行故事还原、拼凑记忆，文笔细腻戳人，人物形象饱满立体。',
        story: '该本以特殊病症"斑马症候群"为切入点，关键词为"仿生人和孤独"，讲述一段浪漫治愈的故事。需要进行故事还原、拼凑记忆，文笔细腻戳人，人物形象饱满立体。在一个充满仿生人和孤独的世界里，玩家将体验到温暖与治愈。',
        characters: [
          { name: '患者1', gender: '不限', desc: '斑马症候群患者' },
          { name: '患者2', gender: '不限', desc: '斑马症候群患者' },
          { name: '患者3', gender: '不限', desc: '斑马症候群患者' },
          { name: '患者4', gender: '不限', desc: '斑马症候群患者' },
          { name: '患者5', gender: '不限', desc: '斑马症候群患者' },
          { name: '患者6', gender: '不限', desc: '斑马症候群患者' }
        ],
        features: [
          '情感｜科幻题材',
          '特殊病症设定',
          '浪漫治愈，文笔细腻',
          '适合喜欢情感科幻的玩家'
        ],
        suitable: '适合喜欢科幻情感、治愈题材的玩家。新手友好，适合聚会。',
        notice: '本剧本情感浓度较高，请做好心理准备。请投入角色，体验治愈故事。',
        reviews: [
          {
            id: 1,
            nickname: '情感科幻控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '斑马症候群设定很有创意！治愈故事很温暖！',
            time: '2天前',
            tags: ['科幻', '治愈', '温暖']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '文笔很细腻，仿生人与孤独的主题很戳人~',
            time: '5天前',
            tags: ['文笔', '孤独', '情感']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩科幻情感本，被治愈了！很温暖~',
            time: '1周前',
            tags: ['新手友好', '治愈', '推荐']
          }
        ]
      },
      17: {
        id: 17,
        name: '继承者',
        type: '情感',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.7,
        playCount: 9100,
        roomCount: 227,
        isFree: false,
        price: 68,
        cover: '/images/script-cover-1.png',
        intro: '多线叙事精密交织，权谋、陈年旧事与情感漩涡层层递进。全员"复仇者"人设，包含家族使命、血色复仇、禁忌之恋等元素，高能反转不断。',
        story: '多线叙事精密交织，权谋、陈年旧事与情感漩涡层层递进。全员"复仇者"人设，包含家族使命、血色复仇、禁忌之恋等元素，高能反转不断。在一个充满权谋与复仇的世界里，每个人都在为自己的目标而战。',
        characters: [
          { name: '继承者1', gender: '不限', desc: '家族继承人' },
          { name: '继承者2', gender: '不限', desc: '家族继承人' },
          { name: '继承者3', gender: '不限', desc: '家族继承人' },
          { name: '继承者4', gender: '不限', desc: '家族继承人' },
          { name: '继承者5', gender: '不限', desc: '家族继承人' },
          { name: '继承者6', gender: '不限', desc: '家族继承人' }
        ],
        features: [
          '情感｜权谋题材',
          '多线叙事',
          '复仇者人设，反转不断',
          '适合喜欢权谋情感的玩家'
        ],
        suitable: '适合喜欢权谋、复仇题材的玩家。建议喜欢复杂剧情的玩家参加。',
        notice: '本剧本多线叙事，请认真梳理剧情。请投入角色，体验权谋博弈。',
        reviews: [
          {
            id: 1,
            nickname: '权谋爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '多线叙事设计得很巧妙！反转不断！',
            time: '3天前',
            tags: ['权谋', '反转', '精彩']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '复仇者人设很带感，权谋博弈很精彩~',
            time: '1周前',
            tags: ['复仇', '权谋', '精彩']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩权谋本，体验感很好！剧情很精彩~',
            time: '2周前',
            tags: ['新手友好', '权谋', '推荐']
          }
        ]
      },
      18: {
        id: 18,
        name: '我闻神仙亦有死',
        type: '古风',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.8,
        playCount: 14200,
        roomCount: 355,
        isFree: false,
        price: 78,
        cover: '/images/script-cover-2.png',
        intro: '以清嘉庆年间的宁舟城为背景，六扇门捕快奉命追捕妖道"待秋仙翁"，他连杀天师将军，手法诡谲。玩家扮演子鼠、寅虎等六名捕快，手握仅一页的核心设定，需破解从破冰小案到八卦连环案再到三连杀核诡的八个案件。',
        story: '以清嘉庆年间的宁舟城为背景，六扇门捕快奉命追捕妖道"待秋仙翁"，他连杀天师将军，手法诡谲。玩家扮演子鼠、寅虎等六名捕快，手握仅一页的核心设定，需破解从破冰小案到八卦连环案再到三连杀核诡的八个案件。每一个案件都暗藏玄机，每一次推理都通向真相。',
        characters: [
          { name: '子鼠', gender: '不限', desc: '六扇门捕快' },
          { name: '寅虎', gender: '不限', desc: '六扇门捕快' },
          { name: '捕快1', gender: '不限', desc: '六扇门捕快' },
          { name: '捕快2', gender: '不限', desc: '六扇门捕快' },
          { name: '捕快3', gender: '不限', desc: '六扇门捕快' },
          { name: '捕快4', gender: '不限', desc: '六扇门捕快' }
        ],
        features: [
          '古风｜推理题材',
          '清代背景',
          '八个案件，层层递进',
          '适合喜欢古风推理的玩家'
        ],
        suitable: '适合喜欢古风、推理题材的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本包含八个案件，请耐心分析。请认真对待每个线索。',
        reviews: [
          {
            id: 1,
            nickname: '古风推理控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '清代背景很吸引人！八个案件设计得很巧妙！',
            time: '2天前',
            tags: ['古风', '推理', '巧妙']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '八卦连环案设计得很好，核诡很精彩~',
            time: '5天前',
            tags: ['推理', '核诡', '精彩']
          },
          {
            id: 3,
            nickname: '新手玩家',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩古风推理本，体验感很好！案件很有趣~',
            time: '1周前',
            tags: ['新手友好', '古风', '推荐']
          }
        ]
      },
      19: {
        id: 19,
        name: '贪欢',
        type: '古风',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.0,
        playCount: 16700,
        roomCount: 417,
        isFree: false,
        price: 65,
        cover: '/images/script-cover-3.png',
        intro: '以架空古风王朝为背景，描绘皇权更迭与世家争斗下，一群"局中人"在盛世阴影里的爱恨纠葛。玩家将扮演皇子、公主、将军、质子等身份各异的角色，通过大量互动演绎与私密"小黑屋"环节。',
        story: '以架空古风王朝为背景，描绘皇权更迭与世家争斗下，一群"局中人"在盛世阴影里的爱恨纠葛。玩家将扮演皇子、公主、将军、质子等身份各异的角色，通过大量互动演绎与私密"小黑屋"环节。每个人都是棋子，每个人都在为了自己的目标和欲望而战。',
        characters: [
          { name: '皇子', gender: '男', desc: '皇室成员' },
          { name: '公主', gender: '女', desc: '皇室成员' },
          { name: '将军', gender: '男', desc: '朝廷大将' },
          { name: '质子', gender: '不限', desc: '人质' },
          { name: '贵族1', gender: '不限', desc: '世家成员' },
          { name: '贵族2', gender: '不限', desc: '世家成员' }
        ],
        features: [
          '古风｜权谋题材',
          '皇权更迭',
          '爱恨纠葛，身份各异',
          '适合喜欢古风权谋的玩家'
        ],
        suitable: '适合喜欢古风权谋、身份扮演的玩家。建议喜欢演绎互动的玩家参加。',
        notice: '本剧本包含私密环节，请尊重角色设定。请投入角色，体验宫廷斗争。',
        reviews: [
          {
            id: 1,
            nickname: '古风权谋控',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '皇权更迭设定很吸引人！爱恨纠葛很深刻！',
            time: '3天前',
            tags: ['古风', '权谋', '深刻']
          },
          {
            id: 2,
            nickname: '演绎玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '互动演绎很丰富，私密环节设计得很好~',
            time: '1周前',
            tags: ['演绎', '互动', '精彩']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩宫廷权谋本，体验感很好！很精彩~',
            time: '2周前',
            tags: ['新手友好', '宫廷', '推荐']
          }
        ]
      },
      20: {
        id: 20,
        name: '不容',
        type: '古风',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 9.1,
        playCount: 18900,
        roomCount: 472,
        isFree: false,
        price: 69,
        cover: '/images/script-cover-4.png',
        intro: '以战争为背景，生逢乱世，命不由人，将每个人卷入复杂的情感纠葛和家国纷争之中。文笔优秀，人设新颖，NPC塑造有血有肉，结合抓马设定和不停反转，加入"错位成婚、纯爱恨陪"等元素，可玩性高。',
        story: '以战争为背景，生逢乱世，命不由人，将每个人卷入复杂的情感纠葛和家国纷争之中。文笔优秀，人设新颖，NPC塑造有血有肉，结合抓马设定和不停反转，加入"错位成婚、纯爱恨陪"等元素，可玩性高。在乱世之中，每个人都在寻找自己的出路。',
        characters: [
          { name: '乱世之人1', gender: '不限', desc: '乱世中的角色' },
          { name: '乱世之人2', gender: '不限', desc: '乱世中的角色' },
          { name: '乱世之人3', gender: '不限', desc: '乱世中的角色' },
          { name: '乱世之人4', gender: '不限', desc: '乱世中的角色' },
          { name: '乱世之人5', gender: '不限', desc: '乱世中的角色' },
          { name: '乱世之人6', gender: '不限', desc: '乱世中的角色' }
        ],
        features: [
          '古风｜战争题材',
          '乱世背景',
          '家国纷争，情感纠葛',
          '适合喜欢战争情感的玩家'
        ],
        suitable: '适合喜欢战争题材、情感纠葛的玩家。建议喜欢复杂剧情的玩家参加。',
        notice: '本剧本涉及战争题材，请尊重角色设定。请投入角色，体验乱世情感。',
        reviews: [
          {
            id: 1,
            nickname: '战争题材控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '乱世背景很吸引人！家国纷争很深刻！',
            time: '2天前',
            tags: ['战争', '乱世', '深刻']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '文笔很优秀，NPC塑造有血有肉~',
            time: '5天前',
            tags: ['文笔', 'NPC', '深刻']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩战争本，体验感很好！很感人~',
            time: '1周前',
            tags: ['新手友好', '战争', '推荐']
          }
        ]
      },
      21: {
        id: 21,
        name: '赌王之王',
        type: '欢乐',
        difficulty: '困难',
        playerCount: 7,
        duration: 4,
        rating: 8.8,
        playCount: 17800,
        roomCount: 445,
        isFree: false,
        price: 67,
        cover: '/images/script-cover-5.png',
        intro: '以拉斯维加斯赌城为背景，七位赌徒为争夺"国际赌王"头衔与上亿奖金展开疯狂博弈。玩家将扮演赌坊常客（大刚/陈爷等角色），通过轮盘赌、梭哈、拍卖等十余种机制游戏积累财富。',
        story: '以拉斯维加斯赌城为背景，七位赌徒为争夺"国际赌王"头衔与上亿奖金展开疯狂博弈。玩家将扮演赌坊常客（大刚/陈爷等角色），通过轮盘赌、梭哈、拍卖等十余种机制游戏积累财富。在赌桌上，每个人都是赌徒，每个人都在为了荣誉和财富而战。',
        characters: [
          { name: '大刚', gender: '男', desc: '赌坊常客' },
          { name: '陈爷', gender: '男', desc: '赌坊常客' },
          { name: '赌徒1', gender: '不限', desc: '争夺赌王' },
          { name: '赌徒2', gender: '不限', desc: '争夺赌王' },
          { name: '赌徒3', gender: '不限', desc: '争夺赌王' },
          { name: '赌徒4', gender: '不限', desc: '争夺赌王' },
          { name: '赌徒5', gender: '不限', desc: '争夺赌王' }
        ],
        features: [
          '欢乐｜赌场题材',
          '十余种机制',
          '疯狂博弈，竞争激烈',
          '适合喜欢机制欢乐的玩家'
        ],
        suitable: '适合喜欢赌场题材、机制游戏的玩家。新手友好，适合聚会。',
        notice: '本剧本机制丰富，请认真阅读规则。欢乐氛围，请尽情享受游戏。',
        reviews: [
          {
            id: 1,
            nickname: '机制本爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '赌场题材很新鲜！十余种机制很有趣！',
            time: '3天前',
            tags: ['机制', '赌场', '有趣']
          },
          {
            id: 2,
            nickname: '欢乐玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '机制各具特色，竞争很激烈~',
            time: '1周前',
            tags: ['欢乐', '竞争', '机制']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩赌场本，体验感很好！很欢乐~',
            time: '2周前',
            tags: ['新手友好', '欢乐', '推荐']
          }
        ]
      },
      22: {
        id: 22,
        name: '青竹馆事件',
        type: '日式',
        difficulty: '中等',
        playerCount: 6,
        duration: 3,
        rating: 8.5,
        playCount: 9800,
        roomCount: 245,
        isFree: false,
        price: 59,
        cover: '/images/script-cover-6.png',
        intro: '玩家将扮演6位高中推理社成员，受邀前往青竹馆，见证竹中慎吾封笔之作的诞生，共同揭开尘封十五年的真相。',
        story: '玩家将扮演6位高中推理社成员，受邀前往青竹馆，见证竹中慎吾封笔之作的诞生，共同揭开尘封十五年的真相。在青竹馆中，每一个角落都隐藏着秘密，每一个线索都通向真相。',
        characters: [
          { name: '推理社成员1', gender: '不限', desc: '高中推理社成员' },
          { name: '推理社成员2', gender: '不限', desc: '高中推理社成员' },
          { name: '推理社成员3', gender: '不限', desc: '高中推理社成员' },
          { name: '推理社成员4', gender: '不限', desc: '高中推理社成员' },
          { name: '推理社成员5', gender: '不限', desc: '高中推理社成员' },
          { name: '推理社成员6', gender: '不限', desc: '高中推理社成员' }
        ],
        features: [
          '日式｜推理题材',
          '高中推理社',
          '尘封真相，经典推理',
          '适合喜欢日式推理的玩家'
        ],
        suitable: '适合喜欢日式推理、校园题材的玩家。建议有一定推理经验的玩家参加。',
        notice: '本剧本注重推理，请认真梳理线索，理清人物关系。',
        reviews: [
          {
            id: 1,
            nickname: '日式推理控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '日式推理本！封笔之作设定很吸引人！',
            time: '2天前',
            tags: ['日式', '推理', '经典']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '尘封十五年的真相设计得很好，推理体验很棒~',
            time: '5天前',
            tags: ['推理', '真相', '精彩']
          },
          {
            id: 3,
            nickname: '新手小萌',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩日式推理本，体验感很好！很有趣~',
            time: '1周前',
            tags: ['新手友好', '日式', '推荐']
          }
        ]
      },
      23: {
        id: 23,
        name: '奇异人生2100',
        type: '科幻',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.1,
        playCount: 24300,
        roomCount: 607,
        isFree: false,
        price: 70,
        cover: '/images/script-cover-7.png',
        intro: '欢迎来到奇异人生游戏公司。玩家将进入第一人称VR游戏，体验2100年的赛博朋克世界。6位队员需要共同审判这个世界的一切：秩序、压迫、人工智能、爱、虚伪、自由、战争...',
        story: '欢迎来到奇异人生游戏公司。玩家将进入第一人称VR游戏，体验2100年的赛博朋克世界。6位队员需要共同审判这个世界的一切：秩序、压迫、人工智能、爱、虚伪、自由、战争...在未来世界里，每个人都有自己的审判标准，每个选择都影响结局。',
        characters: [
          { name: '玩家1', gender: '不限', desc: 'VR游戏参与者' },
          { name: '玩家2', gender: '不限', desc: 'VR游戏参与者' },
          { name: '玩家3', gender: '不限', desc: 'VR游戏参与者' },
          { name: '玩家4', gender: '不限', desc: 'VR游戏参与者' },
          { name: '玩家5', gender: '不限', desc: 'VR游戏参与者' },
          { name: '玩家6', gender: '不限', desc: 'VR游戏参与者' }
        ],
        features: [
          '科幻｜赛博朋克',
          'VR游戏设定',
          '审判世界，多重结局',
          '适合喜欢科幻赛博的玩家'
        ],
        suitable: '适合喜欢科幻、赛博朋克题材的玩家。建议喜欢沉浸式体验的玩家参加。',
        notice: '本剧本涉及哲学思考，请认真对待每个选择。请投入角色，体验未来世界。',
        reviews: [
          {
            id: 1,
            nickname: '科幻控',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '赛博朋克设定很吸引人！VR游戏体验很棒！',
            time: '3天前',
            tags: ['科幻', '赛博', 'VR']
          },
          {
            id: 2,
            nickname: '沉浸玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '审判世界的设定很有深度，多重结局很有趣~',
            time: '1周前',
            tags: ['审判', '结局', '深度']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩赛博朋克本，体验感很好！世界观很震撼~',
            time: '2周前',
            tags: ['新手友好', '赛博', '推荐']
          }
        ]
      },
      24: {
        id: 24,
        name: '请阅读至100.1%',
        type: '推理',
        difficulty: '困难',
        playerCount: 7,
        duration: 4,
        rating: 8.9,
        playCount: 15600,
        roomCount: 390,
        isFree: false,
        price: 67,
        cover: '/images/script-cover-8.png',
        intro: '该本以"小说"这一写作载体切入推理，代入"作者"和"小说人物"的身份与视角感受"一句话反转"。采用POV网状叙事+长逻辑链+多重反转的形式，推理与还原占比为2:8。',
        story: '该本以"小说"这一写作载体切入推理，代入"作者"和"小说人物"的身份与视角感受"一句话反转"。采用POV网状叙事+长逻辑链+多重反转的形式，推理与还原占比为2:8。在小说与现实交织的世界里，玩家需要找到真相。',
        characters: [
          { name: '作者', gender: '不限', desc: '小说作者' },
          { name: '小说人物1', gender: '不限', desc: '小说中的人物' },
          { name: '小说人物2', gender: '不限', desc: '小说中的人物' },
          { name: '小说人物3', gender: '不限', desc: '小说中的人物' },
          { name: '小说人物4', gender: '不限', desc: '小说中的人物' },
          { name: '小说人物5', gender: '不限', desc: '小说中的人物' },
          { name: '小说人物6', gender: '不限', desc: '小说中的人物' }
        ],
        features: [
          '推理｜小说题材',
          'POV网状叙事',
          '长逻辑链，多重反转',
          '适合喜欢叙事推理的玩家'
        ],
        suitable: '适合喜欢叙事推理、复杂剧情的玩家。建议有丰富推理经验的玩家参加。',
        notice: '本剧本叙事复杂，请认真梳理。请耐心分析长逻辑链。',
        reviews: [
          {
            id: 1,
            nickname: '叙事推理控',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: 'POV网状叙事设计得很巧妙！一句话反转太精彩了！',
            time: '2天前',
            tags: ['POV', '反转', '精彩']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '长逻辑链设计得很好，多重反转很烧脑~',
            time: '5天前',
            tags: ['逻辑', '反转', '烧脑']
          },
          {
            id: 3,
            nickname: '推理高手',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩这种叙事本，成就感爆棚！',
            time: '1周前',
            tags: ['叙事', '成就', '推荐']
          }
        ]
      },
      25: {
        id: 25,
        name: '45贰蕴神',
        type: '惊悚',
        difficulty: '困难',
        playerCount: 6,
        duration: 5,
        rating: 9.3,
        playCount: 28900,
        roomCount: 722,
        isFree: false,
        price: 77,
        cover: '/images/script-cover-1.png',
        intro: '以传说中的藏神村为舞台，六名受邀者踏入这个尘封已久的村落，探寻蜕凡成神的秘密。玩家将扮演梁锦绣、夏星河等角色，在4-6小时的沉浸体验中，通过50余张线索卡与声光电演绎，揭开历史长河中的悲剧真相。',
        story: '以传说中的藏神村为舞台，六名受邀者踏入这个尘封已久的村落，探寻蜕凡成神的秘密。玩家将扮演梁锦绣、夏星河等角色，在4-6小时的沉浸体验中，通过50余张线索卡与声光电演绎，揭开历史长河中的悲剧真相。在藏神村中，每个人都有秘密，每个角落都隐藏着真相。',
        characters: [
          { name: '梁锦绣', gender: '不限', desc: '受邀者' },
          { name: '夏星河', gender: '不限', desc: '受邀者' },
          { name: '受邀者1', gender: '不限', desc: '探寻成神秘密' },
          { name: '受邀者2', gender: '不限', desc: '探寻成神秘密' },
          { name: '受邀者3', gender: '不限', desc: '探寻成神秘密' },
          { name: '受邀者4', gender: '不限', desc: '探寻成神秘密' }
        ],
        features: [
          '惊悚｜悬疑题材',
          '藏神村设定',
          '沉浸演绎，线索丰富',
          '适合喜欢惊悚悬疑的玩家'
        ],
        suitable: '适合喜欢惊悚、悬疑题材的玩家。建议有丰富推理经验的玩家参加。',
        notice: '本剧本时长较长，请做好准备。请认真对待每个线索。',
        reviews: [
          {
            id: 1,
            nickname: '惊悚爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '藏神村设定很吸引人！沉浸演绎很棒！',
            time: '3天前',
            tags: ['惊悚', '演绎', '沉浸']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '50余张线索卡设计得很好，推理体验很棒~',
            time: '1周前',
            tags: ['线索', '推理', '精彩']
          },
          {
            id: 3,
            nickname: '惊悚玩家',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩惊悚本，体验感很好！很刺激~',
            time: '2周前',
            tags: ['惊悚', '刺激', '推荐']
          }
        ]
      },
      26: {
        id: 26,
        name: '祭日快乐',
        type: '惊悚',
        difficulty: '困难',
        playerCount: 6,
        duration: 5,
        rating: 9.2,
        playCount: 21500,
        roomCount: 537,
        isFree: false,
        price: 79,
        cover: '/images/script-cover-2.png',
        intro: '一场看似热闹的生日宴，六个心怀鬼胎的好友。亲情，爱情，执念…皆可成为献祭的筹码。这里没有纯粹的善意，只有精心编织的谎言与交易。当祝福变成诅咒，当愿望需要血偿...',
        story: '一场看似热闹的生日宴，六个心怀鬼胎的好友。亲情，爱情，执念…皆可成为献祭的筹码。这里没有纯粹的善意，只有精心编织的谎言与交易。当祝福变成诅咒，当愿望需要血偿...在生日宴上，每个人都有秘密，每个人都可能是凶手。',
        characters: [
          { name: '好友1', gender: '不限', desc: '生日宴参与者' },
          { name: '好友2', gender: '不限', desc: '生日宴参与者' },
          { name: '好友3', gender: '不限', desc: '生日宴参与者' },
          { name: '好友4', gender: '不限', desc: '生日宴参与者' },
          { name: '好友5', gender: '不限', desc: '生日宴参与者' },
          { name: '好友6', gender: '不限', desc: '生日宴参与者' }
        ],
        features: [
          '惊悚｜悬疑题材',
          '生日宴设定',
          '心怀鬼胎，悬疑重重',
          '适合喜欢惊悚悬疑的玩家'
        ],
        suitable: '适合喜欢惊悚、悬疑题材的玩家。建议喜欢紧张氛围的玩家参加。',
        notice: '本剧本氛围紧张，请做好心理准备。请投入角色，体验悬疑剧情。',
        reviews: [
          {
            id: 1,
            nickname: '惊悚爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '生日宴设定很吸引人！悬疑氛围很棒！',
            time: '2天前',
            tags: ['惊悚', '悬疑', '氛围']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '心怀鬼胎的设定很带感，悬疑设计很精彩~',
            time: '5天前',
            tags: ['悬疑', '惊悚', '精彩']
          },
          {
            id: 3,
            nickname: '惊悚玩家',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩生日宴惊悚本，体验感很好！很刺激~',
            time: '1周前',
            tags: ['新手友好', '惊悚', '推荐']
          }
        ]
      },
      27: {
        id: 27,
        name: 'U',
        type: '推理',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.0,
        playCount: 19800,
        roomCount: 495,
        isFree: false,
        price: 68,
        cover: '/images/script-cover-3.png',
        intro: '一花一世界，一树一菩提。宇宙中漂浮的那些"世界"渺小如尘埃，它们或绚烂，或沉寂，或具象，或……当中子星再一次推开那间房间的门，已经是几个月之后的事情了...',
        story: '一花一世界，一树一菩提。宇宙中漂浮的那些"世界"渺小如尘埃，它们或绚烂，或沉寂，或具象，或……当中子星再一次推开那间房间的门，已经是几个月之后的事情了...在无尽的宇宙中，每个世界都有自己的故事，每个世界都有自己的真相。',
        characters: [
          { name: '中子星', gender: '不限', desc: '宇宙探索者' },
          { name: '探索者1', gender: '不限', desc: '宇宙探索者' },
          { name: '探索者2', gender: '不限', desc: '宇宙探索者' },
          { name: '探索者3', gender: '不限', desc: '宇宙探索者' },
          { name: '探索者4', gender: '不限', desc: '宇宙探索者' },
          { name: '探索者5', gender: '不限', desc: '宇宙探索者' }
        ],
        features: [
          '推理｜宇宙题材',
          '多元世界设定',
          '哲学思考，意境深远',
          '适合喜欢哲学推理的玩家'
        ],
        suitable: '适合喜欢宇宙题材、哲学推理的玩家。建议喜欢深度思考的玩家参加。',
        notice: '本剧本涉及哲学思考，请认真对待每个细节。请耐心品味意境。',
        reviews: [
          {
            id: 1,
            nickname: '哲学推理控',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '多元世界设定很吸引人！哲学思考很深刻！',
            time: '3天前',
            tags: ['哲学', '宇宙', '深刻']
          },
          {
            id: 2,
            nickname: '推理达人',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '意境很深远，一花一世界的设定很棒~',
            time: '1周前',
            tags: ['意境', '哲学', '深刻']
          },
          {
            id: 3,
            nickname: '推理高手',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩宇宙题材推理本，体验感很好！很有深度~',
            time: '2周前',
            tags: ['宇宙', '哲学', '推荐']
          }
        ]
      },
      28: {
        id: 28,
        name: '体温',
        type: '情感',
        difficulty: '中等',
        playerCount: 6,
        duration: 6,
        rating: 8.7,
        playCount: 14500,
        roomCount: 362,
        isFree: false,
        price: 65,
        cover: '/images/script-cover-4.png',
        intro: '以现代修仙界"香坛会"为舞台，调香师们凭借独特香料操纵欲望、汲取灵力，玩家扮演六名天赋各异的参会者，在氤氲香气与心跳监测、制香破冰等新颖互动中，卷入一场关乎爱恨、权力与种族存续的隐秘战争。',
        story: '以现代修仙界"香坛会"为舞台，调香师们凭借独特香料操纵欲望、汲取灵力，玩家扮演六名天赋各异的参会者，在氤氲香气与心跳监测、制香破冰等新颖互动中，卷入一场关乎爱恨、权力与种族存续的隐秘战争。在香坛会中，每个人都有自己的秘密，每个人都有自己的目的。',
        characters: [
          { name: '调香师1', gender: '不限', desc: '香坛会成员' },
          { name: '调香师2', gender: '不限', desc: '香坛会成员' },
          { name: '调香师3', gender: '不限', desc: '香坛会成员' },
          { name: '调香师4', gender: '不限', desc: '香坛会成员' },
          { name: '调香师5', gender: '不限', desc: '香坛会成员' },
          { name: '调香师6', gender: '不限', desc: '香坛会成员' }
        ],
        features: [
          '情感｜修仙题材',
          '现代修仙设定',
          '新颖互动，沉浸体验',
          '适合喜欢修仙情感的玩家'
        ],
        suitable: '适合喜欢修仙、情感题材的玩家。建议喜欢沉浸式体验的玩家参加。',
        notice: '本剧本情感浓度较高，请做好心理准备。请投入角色，体验修仙世界。',
        reviews: [
          {
            id: 1,
            nickname: '修仙爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '现代修仙设定很新鲜！新颖互动很吸引人！',
            time: '2天前',
            tags: ['修仙', '互动', '新颖']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '香坛会设定很吸引人，情感刻画很到位~',
            time: '5天前',
            tags: ['修仙', '情感', '深刻']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩修仙本，体验感很好！很新颖~',
            time: '1周前',
            tags: ['新手友好', '修仙', '推荐']
          }
        ]
      },
      29: {
        id: 29,
        name: '草芥',
        type: '古风',
        difficulty: '简单',
        playerCount: 6,
        duration: 4,
        rating: 8.6,
        playCount: 13200,
        roomCount: 330,
        isFree: false,
        price: 58,
        cover: '/images/script-cover-5.png',
        intro: '该本以"江湖武林+朝廷纷争"为双主线，讲述一群少年在动荡时代中的成长、抉择与坚守。文笔优秀细腻，既有江湖热血也有权谋责任，情感更是多线开花，有亲情、爱情、成长、群像，人物羁绊强。',
        story: '该本以"江湖武林+朝廷纷争"为双主线，讲述一群少年在动荡时代中的成长、抉择与坚守。文笔优秀细腻，既有江湖热血也有权谋责任，情感更是多线开花，有亲情、爱情、成长、群像，人物羁绊强。在动荡时代中，每个人都在为自己的信念而战。',
        characters: [
          { name: '少年1', gender: '不限', desc: '江湖少年' },
          { name: '少年2', gender: '不限', desc: '江湖少年' },
          { name: '少年3', gender: '不限', desc: '江湖少年' },
          { name: '少年4', gender: '不限', desc: '江湖少年' },
          { name: '少年5', gender: '不限', desc: '江湖少年' },
          { name: '少年6', gender: '不限', desc: '江湖少年' }
        ],
        features: [
          '古风｜江湖题材',
          '双主线叙事',
          '少年成长，人物羁绊',
          '适合喜欢江湖热血的玩家'
        ],
        suitable: '适合喜欢江湖、成长题材的玩家。新手友好，适合聚会。',
        notice: '本剧本情感丰富，请投入角色体验。请感受少年们的成长与坚守。',
        reviews: [
          {
            id: 1,
            nickname: '江湖爱好者',
            avatar: '/images/default-avatar.png',
            rating: 5,
            content: '江湖武林设定很吸引人！少年成长很感人！',
            time: '3天前',
            tags: ['江湖', '成长', '热血']
          },
          {
            id: 2,
            nickname: '情感玩家',
            avatar: '/images/avatar5.png',
            rating: 4,
            content: '文笔很优秀，人物羁绊很强~',
            time: '1周前',
            tags: ['文笔', '羁绊', '精彩']
          },
          {
            id: 3,
            nickname: '新手小白',
            avatar: '/images/avatar6.png',
            rating: 5,
            content: '第一次玩江湖本，体验感很好！很热血~',
            time: '2周前',
            tags: ['新手友好', '江湖', '推荐']
          }
        ]
      },
      30: {
        id: 30,
        name: '我唯一忏悔的事',
        type: '暗黑',
        difficulty: '困难',
        playerCount: 6,
        duration: 6,
        rating: 9.4,
        playCount: 26700,
        roomCount: 667,
        isFree: false,
        price: 79,
        cover: '/images/script-cover-6.png',
        intro: '以架空吸血鬼世界为背景，讲述了一群被欲望、血缘与诅咒捆绑的灵魂，在科隆圣教堂内展开关于罪与罚的终极博弈。玩家将扮演六位身份各异的角色（如警监"北极"、诈骗师"十一月"等）。',
        story: '以架空吸血鬼世界为背景，讲述了一群被欲望、血缘与诅咒捆绑的灵魂，在科隆圣教堂内展开关于罪与罚的终极博弈。玩家将扮演六位身份各异的角色（如警监"北极"、诈骗师"十一月"等）。在吸血鬼世界中，每个人都有自己的罪，每个人都需要忏悔。',
        characters: [
          { name: '北极', gender: '不限', desc: '警监' },
          { name: '十一月', gender: '不限', desc: '诈骗师' },
          { name: '角色1', gender: '不限', desc: '吸血鬼世界角色' },
          { name: '角色2', gender: '不限', desc: '吸血鬼世界角色' },
          { name: '角色3', gender: '不限', desc: '吸血鬼世界角色' },
          { name: '角色4', gender: '不限', desc: '吸血鬼世界角色' }
        ],
        features: [
          '暗黑｜吸血鬼题材',
          '罪与罚设定',
          '欲望血缘，诅咒捆绑',
          '适合喜欢暗黑吸血鬼的玩家'
        ],
        suitable: '适合喜欢暗黑、吸血鬼题材的玩家。建议喜欢深度剧情的玩家参加。',
        notice: '本剧本暗黑氛围较重，请做好心理准备。请投入角色，体验吸血鬼世界。',
        reviews: [
          {
            id: 1,
            nickname: '暗黑爱好者',
            avatar: '/images/avatar1.png',
            rating: 5,
            content: '吸血鬼世界设定很吸引人！罪与罚很深刻！',
            time: '2天前',
            tags: ['暗黑', '吸血鬼', '深刻']
          },
          {
            id: 2,
            nickname: '深度玩家',
            avatar: '/images/avatar2.png',
            rating: 4,
            content: '欲望血缘的设定很带感，诅咒捆绑很精彩~',
            time: '5天前',
            tags: ['暗黑', '欲望', '精彩']
          },
          {
            id: 3,
            nickname: '暗黑玩家',
            avatar: '/images/avatar3.png',
            rating: 5,
            content: '第一次玩吸血鬼本，体验感很好！很震撼~',
            time: '1周前',
            tags: ['新手友好', '暗黑', '推荐']
          }
        ]
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
      notice: '暂无注意事项',
      reviews: []
    };

    this.setData({ script });
    // 初始化筛选后的评价列表
    this.filterReviews({ currentTarget: { dataset: { type: 'all' } } });
  },

  // 筛选评价
  filterReviews(e) {
    const filterType = e.currentTarget.dataset.type;
    const reviews = this.data.script.reviews || [];
    let filteredReviews = reviews;

    // 根据评分筛选
    if (filterType === 'recommended') {
      filteredReviews = reviews.filter(r => r.rating >= 5);
    } else if (filterType === 'average') {
      filteredReviews = reviews.filter(r => r.rating === 4);
    } else if (filterType === 'bad') {
      filteredReviews = reviews.filter(r => r.rating <= 3);
    }
    // 'all' 和 'sameCity' 显示全部评价（'sameCity' 需要后端支持，暂时显示全部）

    this.setData({
      filterType,
      filteredReviews
    });
  },

  // 获取评分分布百分比
  getRatingPercent(rating, reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const count = reviews.filter(r => r.rating === rating).length;
    return Math.round((count / reviews.length) * 100);
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

  // 加载拼车记录
  loadCarpoolRecords(scriptId) {
    // 模拟拼车数据
    const carpoolData = [
      {
        id: 1,
        shopName: '谜案探案馆',
        distance: '2.3km',
        startTime: '今天 14:00',
        neededPlayers: 2
      },
      {
        id: 2,
        shopName: '沉浸式剧场',
        distance: '3.5km',
        startTime: '今天 19:30',
        neededPlayers: 3
      },
      {
        id: 3,
        shopName: '剧本杀体验店',
        distance: '1.8km',
        startTime: '明天 15:00',
        neededPlayers: 1
      }
    ];
    this.setData({ carpoolRecords: carpoolData });
  },

  // 加入拼车
  joinCarpool(e) {
    const carpoolId = e.currentTarget.dataset.id;
    const app = getApp();
    const currentCoins = app.getCoins();

    // 查找拼车信息
    const carpool = this.data.carpoolRecords.find(c => c.id === carpoolId);
    if (!carpool) {
      wx.showToast({
        title: '拼车信息不存在',
        icon: 'none'
      });
      return;
    }

    // 显示确认弹窗
    wx.showModal({
      title: '确认参与拼车',
      content: `您是否确认参与拼车此剧本《${this.data.script.name}》？\n\n当前金币：${currentCoins}`,
      confirmText: '确认',
      cancelText: '取消',
      confirmColor: '#4CAF50',
      success: (res) => {
        if (res.confirm) {
          // 检查金币是否足够
          const scriptPrice = this.data.script.isFree ? 0 : this.data.script.price;
          if (currentCoins < scriptPrice) {
            wx.showModal({
              title: '金币不足',
              content: `您的金币不足！\n需要：${scriptPrice}金币\n当前：${currentCoins}金币`,
              showCancel: false,
              confirmText: '知道了'
            });
            return;
          }

          // 扣除金币
          const success = app.reduceCoins(scriptPrice);
          if (!success) {
            wx.showToast({
              title: '金币扣除失败',
              icon: 'none'
            });
            return;
          }

          // 调用加入拼车的接口
          wx.showToast({
            title: '正在加入拼车...',
            icon: 'loading'
          });

          setTimeout(() => {
            wx.hideLoading();

            // 保存剧本记录
            this.saveScriptRecord(this.data.script, scriptPrice);

            // 保存交易记录
            this.saveTransaction(this.data.script.name, scriptPrice, 'expense');

            wx.showToast({
              title: `加入成功！消耗${scriptPrice}金币`,
              icon: 'success',
              duration: 2000
            });
          }, 1000);
        }
      }
    });
  },

  // 保存剧本记录
  saveScriptRecord(script, cost) {
    const records = wx.getStorageSync('scriptRecords') || [];
    const newRecord = {
      id: Date.now(),
      scriptId: script.id,
      name: script.name,
      type: script.type,
      difficulty: script.difficulty,
      playerCount: script.playerCount,
      cover: script.cover,
      cost: cost,
      playTime: this.formatTime(new Date())
    };
    records.unshift(newRecord);
    wx.setStorageSync('scriptRecords', records);
  },

  // 保存交易记录
  saveTransaction(scriptName, amount, type) {
    const transactions = wx.getStorageSync('transactions') || [];
    const newTransaction = {
      id: Date.now(),
      name: type === 'expense' ? `参与剧本《${scriptName}》` : '充值',
      amount: amount,
      type: type,
      time: this.formatTime(new Date())
    };
    transactions.unshift(newTransaction);
    wx.setStorageSync('transactions', transactions);
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
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
