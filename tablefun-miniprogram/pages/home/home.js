// pages/home/home.js
Page({
  data: {
    currentCity: '北京',
    searchKeyword: '',
    filterType: 'all',
    showSpecial: false,
    showUrgent: false,
    showFull: false,
    showCityModal: false,
    showDateModal: false,
    showTypeModal: false,
    showSortModal: false,
    selectedDate: '',
    selectedType: '',
    selectedSort: 'hot',
    banners: [
      {
        id: 1,
        title: '热门剧本限时优惠',
        subtitle: '精选剧本8折起',
        image: '/images/banner1.png'
      },
      {
        id: 2,
        title: '新人专属福利',
        subtitle: '注册送100金币',
        image: '/images/banner2.png'
      },
      {
        id: 3,
        title: '周末主题活动',
        subtitle: '双倍经验值',
        image: '/images/banner3.png'
      }
    ],
    cityData: [
      {
        letter: 'A',
        cities: ['鞍山', '安庆', '安阳', '阿坝', '阿克苏', '阿拉善', '阿勒泰', '安康', '安顺', '澳门']
      },
      {
        letter: 'B',
        cities: ['北京', '保定', '包头', '本溪', '宝鸡', '蚌埠', '北海', '巴中', '白城', '白山', '百色', '滨州', '亳州', '保山', '白银', '毕节']
      },
      {
        letter: 'C',
        cities: ['成都', '重庆', '长沙', '长春', '常州', '沧州', '赤峰', '承德', '潮州', '郴州', '长治', '昌都', '楚雄', '池州', '崇左', '滁州', '朝阳']
      },
      {
        letter: 'D',
        cities: ['大连', '东莞', '大庆', '大同', '丹东', '东营', '德州', '大理', '达州', '定西', '德阳', '迪庆', '定安', '东方', '儋州']
      },
      {
        letter: 'E',
        cities: ['鄂尔多斯', '恩施', '鄂州', '二连浩特']
      },
      {
        letter: 'F',
        cities: ['佛山', '福州', '抚顺', '阜新', '阜阳', '抚州', '防城港', '佛山', '抚顺', '阜新', '阜阳', '抚州', '阜新']
      },
      {
        letter: 'G',
        cities: ['广州', '贵阳', '桂林', '赣州', '广元', '贵港', '广安', '甘南', '甘孜', '固原', '嘉峪关', '邯郸', '黄冈', '黄石', '怀化', '淮南', '淮北', '惠州', '河源', '贺州', '黑河', '衡水', '葫芦岛', '呼伦贝尔']
      },
      {
        letter: 'H',
        cities: ['杭州', '合肥', '哈尔滨', '呼和浩特', '海口', '惠州', '衡阳', '邯郸', '湖州', '淮安', '菏泽', '黄山', '葫芦岛', '淮北', '淮南', '黄冈', '黄石', '怀化', '河源', '贺州', '黑河', '衡水', '海东', '海北', '海南', '海西', '哈密', '和田', '河池', '鹤壁', '鹤岗', '红河', 'Hong Kong', '黄山', '惠州']
      },
      {
        letter: 'J',
        cities: ['济南', '吉林', '嘉兴', '锦州', '济宁', '金华', '荆州', '焦作', '佳木斯', '吉安', '江门', '揭阳', '金昌', '景德镇', '九江', '酒泉', '晋中', '晋城', '荆门', '曲靖', '庆阳', '七台河']
      },
      {
        letter: 'K',
        cities: ['昆明', '开封', '喀什', '克拉玛依', '克孜勒苏', '可克达拉', '喀什', '开封', '康定', '昆明']
      },
      {
        letter: 'L',
        cities: ['兰州', '洛阳', '拉萨', '连云港', '柳州', '辽阳', '临沂', '廊坊', '聊城', '六安', '六盘水', '丽江', '临沧', '临汾', '临夏', '陇南', '龙岩', '娄底', '漯河', '泸州', '吕梁', '来宾', '莱芜', '乐山', '丽水', '辽阳', '辽源', '聊城', '林芝', '临汾', '临夏', '六盘水', '六安', '龙岩', '娄底', '连云港', '凉山', '聊城', '柳州', '陇南', '娄底', '洛阳', '漯河', '泸州', '吕梁']
      },
      {
        letter: 'M',
        cities: ['绵阳', '牡丹江', '马鞍山', '茂名', '眉山', '梅州', '佳木斯', '鸡西', '济源', '金昌', '金华', '锦州', '晋城', '晋中', '荆门', '荆州', '景德镇', '九江', '酒泉', '吉安', '揭阳', '江门', '焦作', '嘉兴', '嘉峪关', '佳木斯', '金昌', '金华', '锦州', '晋城', '晋中', '荆门', '荆州', '景德镇', '九江', '酒泉', '眉山', '绵阳', '牡丹江', '马鞍山', '茂名', '梅州', '眉山', '绵阳', '牡丹江', '马鞍山', '茂名', '梅州']
      },
      {
        letter: 'N',
        cities: ['南京', '南宁', '南昌', '宁波', '南通', '南平', '南阳', '那曲', '内江', '南充', '怒江', '宁德', '南平', '南通', '南阳', '内江', '南充', '怒江', '宁德', '南平', '南通', '南阳']
      },
      {
        letter: 'P',
        cities: ['攀枝花', '盘锦', '平顶山', '平凉', '萍乡', '莆田', '普洱', '濮阳', '攀枝花', '盘锦', '平顶山', '平凉', '萍乡', '莆田', '普洱', '濮阳']
      },
      {
        letter: 'Q',
        cities: ['青岛', '齐齐哈尔', '秦皇岛', '泉州', '衢州', '七台河', '钦州', '清远', '庆阳', '曲靖', '黔东南', '黔南', '黔西南', '秦皇岛', '青岛', '七台河', '齐齐哈尔', '钦州', '清远', '庆阳', '曲靖', '衢州']
      },
      {
        letter: 'R',
        cities: ['日喀则', '日照', '日喀则', '日照']
      },
      {
        letter: 'S',
        cities: ['上海', '深圳', '沈阳', '石家庄', '苏州', '汕头', '三亚', '绍兴', '宿迁', '三门峡', '三明', '汕尾', '商洛', '商丘', '上饶', '山南', '汕头', '汕尾', '商洛', '商丘', '上饶', '山南', '邵阳', '十堰', '石河子', '石嘴山', '双鸭山', '朔州', '四平', '松原', '随州', '遂宁', '绥化', '沈阳', '石家庄', '三门峡', '三明', '三亚', '汕头', '汕尾', '商洛', '商丘', '上饶', '山南', '邵阳', '十堰', '石河子', '石嘴山', '双鸭山', '朔州', '四平', '松原', '随州', '遂宁', '绥化', '苏州', '宿迁', '绍兴', '深圳', '上海']
      },
      {
        letter: 'T',
        cities: ['天津', '太原', '唐山', '通化', '泰州', '塔城', '台州', '泰安', '铁岭', '铜川', '通辽', '铜陵', '天门', '天水', '铁门关', '通化', '通辽', '铜陵', '天门', '天水', '铁岭', '铜川', '泰州', '台州', '泰安', '唐山', '太原', '天津', '塔城']
      },
      {
        letter: 'W',
        cities: ['武汉', '无锡', '温州', '潍坊', '芜湖', '威海', '乌鲁木齐', '乌海', '乌兰察布', '文山', '文昌', '万宁', '五指山', '文昌', '万宁', '五指山', '武威', '渭南', '梧州', '吴忠', '武汉', '无锡', '温州', '潍坊', '芜湖', '威海', '乌海', '乌兰察布', '文山', '武威', '渭南', '梧州', '吴忠', '乌鲁木齐']
      },
      {
        letter: 'X',
        cities: ['西安', '厦门', '徐州', '湘潭', '襄阳', '西宁', '咸阳', '西双版纳', '锡林郭勒', '仙桃', '咸宁', '孝感', '邢台', '新乡', '信阳', '新余', '忻州', '宣城', '兴安', '西昌', '湘西', '襄阳', '孝感', '咸宁', '仙桃', '厦门', '西安', '西宁', '锡林郭勒', '西双版纳', '邢台', '新乡', '信阳', '新余', '忻州', '徐州', '宣城', '兴安', '西昌', '湘西', '咸阳']
      },
      {
        letter: 'Y',
        cities: ['烟台', '宜昌', '扬州', '盐城', '营口', '延安', '延边', '阳江', '阳泉', '伊春', '伊犁', '宜宾', '益阳', '永州', '岳阳', '云浮', '运城', '玉溪', '营口', '宜昌', '宜春', '银川', '雅安', '延安', '延边', '阳江', '阳泉', '伊春', '伊犁', '宜宾', '益阳', '永州', '岳阳', '云浮', '运城', '玉溪', '烟台', '扬州', '盐城', '延安']
      },
      {
        letter: 'Z',
        cities: ['郑州', '珠海', '中山', '株洲', '漳州', '镇江', '遵义', '张家口', '张掖', '昭通', '肇庆', '湛江', '枣庄', '张家港', '舟山', '周口', '驻马店', '资阳', '自贡', '中卫', '淄博', '枣庄', '湛江', '肇庆', '昭通', '张掖', '张家口', '张家界', '郑州', '珠海', '中山', '株洲', '漳州', '镇江', '周口', '驻马店', '资阳', '自贡', '中卫', '淄博', '遵义']
      }
    ],
    dateOptions: [],
    scriptTypes: ['恐怖', '推理', '悬疑', '古风', '欧式', '科幻', '情感', '欢乐'],
    sortOptions: [
      { label: '热度排序', value: 'hot' },
      { label: '评分排序', value: 'rating' },
      { label: '时间排序', value: 'time' },
      { label: '价格排序', value: 'price' },
      { label: '人数排序', value: 'players' }
    ],
    hotScripts: [
      {
        id: 1,
        name: '午夜惊魂',
        type: '恐怖',
        difficulty: '困难',
        playerCount: 6,
        duration: 4,
        rating: 9.2,
        playCount: 12580,
        cover: '/images/script-cover-1.png'
      },
      {
        id: 2,
        name: '迷雾侦探',
        type: '推理',
        difficulty: '中等',
        playerCount: 5,
        duration: 3,
        rating: 9.5,
        playCount: 23450,
        cover: '/images/script-cover-2.png'
      },
      {
        id: 3,
        name: '宫廷秘史',
        type: '古风',
        difficulty: '简单',
        playerCount: 7,
        duration: 4,
        rating: 8.9,
        playCount: 8920,
        cover: '/images/script-cover-3.png'
      },
      {
        id: 4,
        name: '悬疑之夜',
        type: '悬疑',
        difficulty: '困难',
        playerCount: 6,
        duration: 5,
        rating: 9.1,
        playCount: 15630,
        cover: '/images/script-cover-4.png'
      }
    ],
    activeRooms: [],
    recommendRooms: [
      {
        id: 1,
        name: '新手友好的推理房',
        scriptName: '迷雾侦探',
        scriptCover: '/images/script-cover-2.png',
        status: 'waiting',
        currentPlayers: 3,
        maxPlayers: 5,
        isSpecial: true,
        isUrgent: false,
        isFull: false
      },
      {
        id: 2,
        name: '恐怖体验局',
        scriptName: '午夜惊魂',
        scriptCover: '/images/script-cover-1.png',
        status: 'waiting',
        currentPlayers: 4,
        maxPlayers: 6,
        isSpecial: false,
        isUrgent: true,
        isFull: false
      },
      {
        id: 3,
        name: '古风爱好者',
        scriptName: '宫廷秘史',
        scriptCover: '/images/script-cover-3.png',
        status: 'waiting',
        currentPlayers: 5,
        maxPlayers: 7,
        isSpecial: false,
        isUrgent: false,
        isFull: true
      }
    ],
    newScripts: [
      {
        id: 5,
        name: '最后的晚餐',
        type: '欧式',
        playerCount: 6,
        intro: '19世纪的欧洲庄园，一场看似普通的晚宴，却隐藏着不可告人的秘密...',
        cover: '/images/script-cover-5.png',
        publishTime: '2小时前'
      },
      {
        id: 6,
        name: '时间旅行者',
        type: '科幻',
        playerCount: 5,
        intro: '2077年，时间旅行成为现实，但当你回到过去，发现历史已被改写...',
        cover: '/images/script-cover-6.png',
        publishTime: '5小时前'
      }
    ]
  },

  onLoad() {
    this.initDateOptions();
    // 假设用户已登录，模拟登录状态
    const app = getApp();
    if (!app.globalData.userInfo) {
      const mockUserInfo = {
        id: 'mock_user_001',
        nickname: '桌友小王',
        avatarUrl: '/images/default-avatar.png',
        level: 3,
        exp: 250,
        coins: 1000,
        createTime: new Date().getTime()
      };
      app.setUserInfo(mockUserInfo);
    }
    this.loadActiveRooms();
  },

  onShow() {
    this.loadActiveRooms();
  },

  // 初始化日期选项
  initDateOptions() {
    const dateOptions = [
      { label: '今天', sub: this.formatDate(0), value: 'today' },
      { label: '明天', sub: this.formatDate(1), value: 'tomorrow' },
      { label: '后天', sub: this.formatDate(2), value: 'day3' },
      { label: '周末', sub: this.formatDate(this.getWeekendDays()), value: 'weekend' },
      { label: '不限', sub: '随时都可以', value: 'all' }
    ];
    this.setData({ dateOptions });
  },

  // 格式化日期
  formatDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${month}-${day} 周${weekDays[date.getDay()]}`;
  },

  // 获取周末天数
  getWeekendDays() {
    const today = new Date();
    const daysUntilSat = (6 - today.getDay()) % 7;
    return daysUntilSat === 0 ? 7 : daysUntilSat;
  },

  // 加载进行中的房间
  loadActiveRooms() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.id) {
      const activeRooms = wx.getStorageSync('activeRooms') || [];
      this.setData({ activeRooms });
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 城市选择
  showCityPicker() {
    this.setData({
      showCityModal: true
    });
  },

  hideCityModal() {
    this.setData({
      showCityModal: false
    });
  },

  selectCity(e) {
    const city = e.currentTarget.dataset.city;
    this.setData({
      currentCity: city,
      showCityModal: false
    });
    this.filterRooms();
  },

  // 筛选选择
  selectFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      filterType: type
    });

    if (type === 'date') {
      this.setData({ showDateModal: true });
    } else if (type === 'area') {
      this.showCityPicker();
    } else if (type === 'type') {
      this.setData({ showTypeModal: true });
    } else if (type === 'sort') {
      this.setData({ showSortModal: true });
    }
  },

  // 日期选择
  hideDateModal() {
    this.setData({
      showDateModal: false
    });
  },

  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({
      selectedDate: date,
      showDateModal: false
    });
    this.filterRooms();
  },

  // 类型选择
  hideTypeModal() {
    this.setData({
      showTypeModal: false
    });
  },

  selectScriptType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type,
      showTypeModal: false
    });
    this.filterRooms();
  },

  // 排序选择
  hideSortModal() {
    this.setData({
      showSortModal: false
    });
  },

  selectSort(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      selectedSort: sort,
      showSortModal: false
    });
    this.sortRooms();
  },

  // 特价筛选
  toggleSpecial() {
    this.setData({
      showSpecial: !this.data.showSpecial
    });
    this.filterRooms();
  },

  // 急车筛选
  toggleUrgent() {
    this.setData({
      showUrgent: !this.data.showUrgent
    });
    this.filterRooms();
  },

  // 即将满车筛选
  toggleFull() {
    this.setData({
      showFull: !this.data.showFull
    });
    this.filterRooms();
  },

  // 筛选房间
  filterRooms() {
    // 实际项目中这里应该调用API进行筛选
    wx.showToast({
      title: '筛选中...',
      icon: 'loading',
      duration: 500
    });
  },

  // 排序房间
  sortRooms() {
    // 实际项目中这里应该调用API进行排序
    wx.showToast({
      title: '排序中...',
      icon: 'loading',
      duration: 500
    });
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 前往剧本列表
  goToScriptList() {
    wx.switchTab({
      url: '/pages/script-list/script-list'
    });
  },

  // 前往创建房间
  goToCreateRoom() {
    wx.switchTab({
      url: '/pages/create-room/create-room'
    });
  },

  // 前往我的收藏
  goToMyScripts() {
    wx.switchTab({
      url: '/pages/my-scripts/my-scripts'
    });
  },

  // 前往个人中心
  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  // 查看剧本详情
  viewScriptDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/script-detail/script-detail?id=${id}`
    });
  },

  // 进入房间
  enterRoom(e) {
    const room = e.currentTarget.dataset.room;
    wx.navigateTo({
      url: `/pages/room/room?roomId=${room.id}`
    });
  },

  // 查看房间详情
  viewRoomDetail(e) {
    const room = e.currentTarget.dataset.room;
    wx.showModal({
      title: '加入房间',
      content: `是否要加入"${room.name}"房间？`,
      success: (res) => {
        if (res.confirm) {
          this.joinRoom(room.id);
        }
      }
    });
  },

  // 加入房间
  joinRoom(roomId) {
    wx.showLoading({ title: '加入中...' });

    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/room/room?roomId=${roomId}`
      });
    }, 1000);
  }
})
