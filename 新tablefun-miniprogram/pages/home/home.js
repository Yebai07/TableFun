// pages/home/home.js
Page({
  data: {
    currentCity: '北京',
    searchKeyword: '',
    filterType: 'all',
    showSpecialUrgent: false,
    showFull: false,
    showCityModal: false,
    showDateModal: false,
    showTypeModal: false,
    showSortModal: false,
    selectedDate: '',
    selectedDateLabel: '',
    selectedType: '',
    selectedSort: 'hot',
    selectedSortLabel: '',
    selectedArea: '',
    districts: [],
    statusBarHeight: 0,
    navBarHeight: 0,
    isFilterFixed: false,
    filterBarTop: 0,
    searchHistory: [],
    showSearchHistory: false,
    searchFocus: false,
    filteredScripts: [],
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
        cities: ['鞍山', '安庆', '安阳', '阿坝']
      },
      {
        letter: 'B',
        cities: ['北京', '保定', '包头', '本溪', '宝鸡', '蚌埠', '北海']
      },
      {
        letter: 'C',
        cities: ['成都', '重庆', '长沙', '长春', '常州', '沧州', '赤峰']
      },
      {
        letter: 'D',
        cities: ['大连', '东莞', '大庆', '大同', '丹东', '东营', '德州']
      },
      {
        letter: 'E',
        cities: ['鄂尔多斯', '恩施']
      },
      {
        letter: 'F',
        cities: ['佛山', '福州', '抚顺', '阜新', '阜阳']
      },
      {
        letter: 'G',
        cities: ['广州', '贵阳', '桂林', '赣州', '广元', '贵港']
      },
      {
        letter: 'H',
        cities: ['杭州', '合肥', '哈尔滨', '呼和浩特', '海口', '惠州', '衡阳', '邯郸', '湖州']
      },
      {
        letter: 'J',
        cities: ['济南', '吉林', '嘉兴', '锦州', '吉林', '济宁', '金华', '荆州', '焦作']
      },
      {
        letter: 'L',
        cities: ['兰州', '洛阳', '拉萨', '连云港', '柳州', '辽阳', '临沂']
      },
      {
        letter: 'M',
        cities: ['绵阳', '牡丹江']
      },
      {
        letter: 'N',
        cities: ['南京', '南宁', '南昌', '宁波', '南通', '南平', '南阳']
      },
      {
        letter: 'Q',
        cities: ['青岛', '齐齐哈尔', '秦皇岛', '泉州', '衢州']
      },
      {
        letter: 'S',
        cities: ['上海', '深圳', '沈阳', '石家庄', '苏州', '汕头', '三亚', '绍兴', '宿迁']
      },
      {
        letter: 'T',
        cities: ['天津', '太原', '唐山', '通化']
      },
      {
        letter: 'W',
        cities: ['武汉', '无锡', '温州', '潍坊', '芜湖', '威海', '乌鲁木齐']
      },
      {
        letter: 'X',
        cities: ['西安', '厦门', '徐州', '湘潭', '襄阳', '西宁', '咸阳']
      },
      {
        letter: 'Y',
        cities: ['烟台', '宜昌', '扬州', '盐城', '营口', '延安']
      },
      {
        letter: 'Z',
        cities: ['郑州', '珠海', '中山', '株洲', '漳州', '镇江', '遵义']
      }
    ],
    dateOptions: [],
    scriptTypes: ['恐怖', '推理', '悬疑', '古风', '欧式', '科幻', '情感', '欢乐', '日式', '都市', '热血', '韩式', '惊悚', '暗黑'],
    sortOptions: [
      { label: '综合排序', value: 'comprehensive' },
      { label: '离我最近', value: 'distance' },
      { label: '热度排序', value: 'hot' },
      { label: '评分排序', value: 'rating' },
      { label: '价格排序', value: 'price' },
      { label: '人数排序', value: 'players' }
    ],
    hotScripts: [
      {
        id: 25,
        name: '45贰蕴神',
        type: '惊悚',
        difficulty: '困难',
        playerCount: 6,
        duration: 5,
        rating: 9.3,
        playCount: 28900,
        cover: '/images/script-cover-1.png'
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
        cover: '/images/script-cover-2.png'
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
        cover: '/images/script-cover-3.png'
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
        cover: '/images/script-cover-4.png'
      }
    ],
    activeRooms: [],
    recommendScripts: [
      {
        id: 2,
        name: '皮囊',
        type: '情感',
        difficulty: '中等',
        playerCount: 6,
        duration: 4,
        rating: 8.8,
        playCount: 23450,
        price: 85,
        cover: '/images/script-cover-2.png',
        isSpecial: true,
        isUrgent: false,
        isFull: false,
        distance: '1.5km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '14:00', needed: 2 },
          { location: '海淀区', date: '明天', time: '19:00', needed: 3 }
        ]
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
        price: 75,
        cover: '/images/script-cover-3.png',
        isSpecial: false,
        isUrgent: true,
        isFull: false,
        distance: '2.3km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '20:00', needed: 1, distance: '2.3km' },
          { location: '海淀区', date: '后天', time: '15:00', needed: 4, distance: '5.1km' }
        ]
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
        price: 65,
        cover: '/images/script-cover-4.png',
        isSpecial: false,
        isUrgent: false,
        isFull: true,
        distance: '0.8km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '13:00', needed: 1, distance: '1.8km' }
        ]
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
        price: 65,
        cover: '/images/script-cover-5.png',
        isSpecial: true,
        isUrgent: false,
        isFull: false,
        distance: '3.5km',
        carpoolRecords: [
          { location: '朝阳区', date: '明天', time: '18:00', needed: 2, distance: '3.5km' },
          { location: '海淀区', date: '周末', time: '14:00', needed: 3, distance: '4.2km' }
        ]
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
        price: 70,
        cover: '/images/script-cover-6.png',
        isSpecial: false,
        isUrgent: true,
        isFull: false,
        distance: '2.7km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '16:00', needed: 2, distance: '2.7km' }
        ]
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
        price: 60,
        cover: '/images/script-cover-7.png',
        isSpecial: false,
        isUrgent: false,
        isFull: false,
        distance: '6.8km',
        carpoolRecords: [
          { location: '朝阳区', date: '明天', time: '19:30', needed: 3, distance: '6.8km' },
          { location: '海淀区', date: '后天', time: '14:00', needed: 2, distance: '5.4km' }
        ]
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
        price: 65,
        cover: '/images/script-cover-8.png',
        isSpecial: true,
        isUrgent: false,
        isFull: false,
        distance: '3.2km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '15:00', needed: 2, distance: '3.2km' }
        ]
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
        price: 70,
        cover: '/images/script-cover-1.png',
        isSpecial: false,
        isUrgent: true,
        isFull: true,
        distance: '4.5km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '18:00', needed: 1, distance: '4.5km' },
          { location: '海淀区', date: '明天', time: '20:00', needed: 1, distance: '6.2km' }
        ]
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
        price: 55,
        cover: '/images/script-cover-2.png',
        isSpecial: false,
        isUrgent: false,
        isFull: false,
        distance: '7.1km',
        carpoolRecords: [
          { location: '朝阳区', date: '后天', time: '16:00', needed: 3, distance: '7.1km' }
        ]
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
        price: 70,
        cover: '/images/script-cover-3.png',
        isSpecial: true,
        isUrgent: false,
        isFull: false,
        distance: '2.9km',
        carpoolRecords: [
          { location: '朝阳区', date: '今天', time: '19:00', needed: 2, distance: '2.9km' },
          { location: '海淀区', date: '周末', time: '14:00', needed: 3, distance: '5.7km' }
        ]
      }
    ],
    newScripts: [
      {
        id: 27,
        name: 'U',
        type: '推理',
        playerCount: 6,
        intro: '一花一世界，一树一菩提。宇宙中漂浮的那些"世界"渺小如尘埃，它们或绚烂，或沉寂，或具象，或……',
        cover: '/images/script-cover-5.png',
        publishTime: '2小时前'
      },
      {
        id: 28,
        name: '体温',
        type: '情感',
        playerCount: 6,
        intro: '以现代修仙界"香坛会"为舞台，调香师们凭借独特香料操纵欲望、汲取灵力，卷入一场隐秘战争。',
        cover: '/images/script-cover-6.png',
        publishTime: '5小时前'
      }
    ]
  },

  onLoad() {
    this.initDateOptions();
    this.getSystemInfo();
    // 加载搜索历史
    this.loadSearchHistory();
    // 获取用户定位
    this.getUserLocation();
    // 加载初始区域数据
    this.loadDistricts(this.data.currentCity);
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
        tags: ['新用户'],
        createTime: new Date().getTime()
      };
      app.setUserInfo(mockUserInfo);
    }
    this.loadActiveRooms();

    // 获取筛选栏的位置
    this.getFilterBarPosition();

    // 初始化筛选后的剧本列表
    this.setData({
      filteredScripts: this.data.recommendScripts
    });
  },

  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    const filterBarTop = this.data.filterBarTop;

    // 当滚动超过筛选栏位置时,固定筛选栏
    if (scrollTop >= filterBarTop && !this.data.isFilterFixed) {
      this.setData({ isFilterFixed: true });
    } else if (scrollTop < filterBarTop && this.data.isFilterFixed) {
      this.setData({ isFilterFixed: false });
    }
  },

  // 获取筛选栏的位置
  getFilterBarPosition() {
    const query = wx.createSelectorQuery();
    query.select('#recommend-section .filter-bar').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        this.setData({
          filterBarTop: res[0].top
        });
      }
    });
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

  // 获取用户定位
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        // 使用腾讯地图API逆地址解析
        this.getLocationByCoordinate(latitude, longitude);
      },
      fail: (err) => {
        console.log('获取定位失败:', err);
        // 定位失败保持默认城市
        wx.showToast({
          title: '定位失败,使用默认城市',
          icon: 'none'
        });
      }
    });
  },

  // 根据坐标获取位置信息
  getLocationByCoordinate(lat, lng) {
    // 简化版定位，直接使用定位的城市（如果需要精确城市，建议申请腾讯地图SDK）
    // 这里使用中国主要城市的大致坐标来模拟
    const cityMap = {
      // 华北
      '北京': { lat: 39.90, lng: 116.40 },
      '天津': { lat: 39.13, lng: 117.20 },
      '石家庄': { lat: 38.04, lng: 114.51 },
      // 华东
      '上海': { lat: 31.23, lng: 121.47 },
      '南京': { lat: 32.06, lng: 118.78 },
      '杭州': { lat: 30.27, lng: 120.15 },
      '济南': { lat: 36.67, lng: 117.00 },
      '合肥': { lat: 31.86, lng: 117.27 },
      '南昌': { lat: 28.68, lng: 115.89 },
      '福州': { lat: 26.07, lng: 119.30 },
      '厦门': { lat: 24.48, lng: 118.10 },
      // 华南
      '广州': { lat: 23.13, lng: 113.27 },
      '深圳': { lat: 22.54, lng: 114.06 },
      '南宁': { lat: 22.82, lng: 108.32 },
      '海口': { lat: 20.04, lng: 110.32 },
      // 华中
      '武汉': { lat: 30.59, lng: 114.31 },
      '长沙': { lat: 28.23, lng: 112.94 },
      '郑州': { lat: 34.76, lng: 113.65 },
      // 西南
      '重庆': { lat: 29.56, lng: 106.55 },
      '成都': { lat: 30.67, lng: 104.06 },
      '贵阳': { lat: 26.65, lng: 106.63 },
      '昆明': { lat: 25.04, lng: 102.71 },
      '拉萨': { lat: 29.65, lng: 91.10 },
      // 西北
      '西安': { lat: 34.27, lng: 108.95 },
      '兰州': { lat: 36.06, lng: 103.84 },
      '西宁': { lat: 36.62, lng: 101.77 },
      '银川': { lat: 38.49, lng: 106.23 },
      '乌鲁木齐': { lat: 43.82, lng: 87.62 },
      // 东北
      '沈阳': { lat: 41.80, lng: 123.43 },
      '大连': { lat: 38.91, lng: 121.62 },
      '长春': { lat: 43.88, lng: 125.32 },
      '哈尔滨': { lat: 45.80, lng: 126.53 }
    };

    // 找到距离最近的城市
    let minDistance = Infinity;
    let cityName = '北京'; // 默认城市

    // 使用传统的for循环，避免Object.entries兼容性问题
    for (const city in cityMap) {
      const coords = cityMap[city];
      const distance = Math.sqrt(
        Math.pow(lat - coords.lat, 2) +
        Math.pow(lng - coords.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        cityName = city;
      }
    }

    // 设置当前城市
    this.setData({
      currentCity: cityName
    });

    // 保存到全局数据
    const app = getApp();
    app.globalData.currentCity = cityName;
    app.globalData.currentLocation = { latitude: lat, longitude: lng };

    // 加载该城市的区域数据
    this.loadDistricts(cityName);

    // 保存到本地存储
    wx.setStorageSync('currentCity', cityName);
    wx.setStorageSync('currentLocation', { latitude: lat, longitude: lng });
  },

  // 加载城市区域数据
  loadDistricts(city) {
    const districtMap = {
      '北京': ['不限', '朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区'],
      '上海': ['不限', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区'],
      '广州': ['不限', '天河区', '越秀区', '海珠区', '荔湾区', '白云区', '番禺区', '黄埔区'],
      '深圳': ['不限', '福田区', '南山区', '罗湖区', '盐田区', '宝安区', '龙岗区'],
      '成都': ['不限', '武侯区', '锦江区', '成华区', '青羊区', '金牛区', '高新区', '天府新区']
    };

    const districts = districtMap[city] || ['不限', '市中心', '城东', '城西', '城南', '城北'];
    this.setData({
      districts: districts
    });
  },

  // 加载搜索历史
  loadSearchHistory() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory: history
    });
  },

  // 保存搜索历史
  saveSearchHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    // 删除重复项
    history = history.filter(item => item !== keyword);
    // 添加到开头
    history.unshift(keyword);
    // 最多保存10条
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    // 保存
    wx.setStorageSync('searchHistory', history);
    this.setData({
      searchHistory: history
    });
  },

  // 清空搜索历史
  clearSearchHistory() {
    wx.removeStorageSync('searchHistory');
    this.setData({
      searchHistory: []
    });
    wx.showToast({
      title: '已清空搜索历史',
      icon: 'none'
    });
  },

  // 使用搜索历史
  useSearchHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword,
      showSearchHistory: false
    });
    this.onSearch();
  },

  // 删除单条搜索历史
  deleteHistoryItem(e) {
    const index = e.currentTarget.dataset.index;
    let history = [...this.data.searchHistory];
    history.splice(index, 1);
    wx.setStorageSync('searchHistory', history);
    this.setData({
      searchHistory: history
    });

    // 如果没有历史记录了,隐藏面板
    if (history.length === 0) {
      this.setData({
        showSearchHistory: false
      });
    }
  },

  // 显示搜索历史
  showSearchHistory() {
    this.setData({
      showSearchHistory: true
    });
  },

  // 隐藏搜索历史
  hideSearchHistory() {
    this.setData({
      showSearchHistory: false
    });
  },

  // 搜索框获取焦点
  onSearchFocus() {
    this.setData({
      searchFocus: true
    });
    if (this.data.searchHistory.length > 0) {
      this.setData({
        showSearchHistory: true
      });
    }
  },

  // 搜索框失去焦点
  onSearchBlur() {
    this.setData({
      searchFocus: false
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 执行搜索
  onSearch() {
    const keyword = this.data.searchKeyword.trim();
    console.log('搜索关键词:', keyword);

    if (!keyword) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }

    // 保存搜索历史
    this.saveSearchHistory(keyword);

    // 隐藏搜索历史
    this.setData({
      showSearchHistory: false
    });

    // 设置全局搜索关键词
    const app = getApp();
    app.globalData.searchKeyword = keyword;
    console.log('已设置全局搜索关键词:', app.globalData.searchKeyword);

    // 跳转到剧本列表页
    wx.switchTab({
      url: '/pages/script-list/script-list',
      success: () => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
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
      this.showDistrictPicker();
    } else if (type === 'type') {
      this.setData({ showTypeModal: true });
    } else if (type === 'sort') {
      this.setData({ showSortModal: true });
    }
  },

  // 显示区域选择器
  showDistrictPicker() {
    this.setData({
      showCityModal: true,
      isDistrictMode: true
    });
  },

  // 日期选择
  hideDateModal() {
    this.setData({
      showDateModal: false
    });
  },

  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    const dateLabel = this.data.dateOptions.find(d => d.value === date)?.label || '日期';
    this.setData({
      selectedDate: date,
      selectedDateLabel: dateLabel,
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
    const sortLabel = this.data.sortOptions.find(s => s.value === sort)?.label || '排序';
    this.setData({
      selectedSort: sort,
      selectedSortLabel: sortLabel,
      showSortModal: false
    });
    this.filterRooms();
  },

  // 城市选择（用于区域模式）
  selectCity(e) {
    const city = e.currentTarget.dataset.city;
    if (this.data.isDistrictMode) {
      // 区域模式
      this.setData({
        selectedArea: city,
        showCityModal: false,
        isDistrictMode: false
      });
      this.filterRooms();
    } else {
      // 城市模式
      this.setData({
        currentCity: city,
        showCityModal: false
      });
      this.loadDistricts(city);
      // 更新导航栏标题
      wx.setNavigationBarTitle({
        title: city + ' ▼'
      });
      this.filterRooms();
    }
  },

  // 特价急车筛选
  toggleSpecialUrgent() {
    this.setData({
      showSpecialUrgent: !this.data.showSpecialUrgent
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
    let filtered = [...this.data.recommendScripts];

    // 特价急车筛选
    if (this.data.showSpecialUrgent) {
      filtered = filtered.filter(script => script.isSpecial || script.isUrgent);
    }

    // 即将满车筛选
    if (this.data.showFull) {
      filtered = filtered.filter(script => script.isFull);
    }

    // 类型筛选
    if (this.data.selectedType) {
      filtered = filtered.filter(script => script.type === this.data.selectedType);
    }

    // 排序
    if (this.data.selectedSort === 'hot') {
      filtered.sort((a, b) => b.playCount - a.playCount);
    } else if (this.data.selectedSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (this.data.selectedSort === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.data.selectedSort === 'players') {
      filtered.sort((a, b) => a.playerCount - b.playerCount);
    } else if (this.data.selectedSort === 'comprehensive') {
      // 综合排序：结合评分、热度等多个因素
      filtered.sort((a, b) => {
        const scoreA = a.rating * 1000 + a.playCount * 0.1;
        const scoreB = b.rating * 1000 + b.playCount * 0.1;
        return scoreB - scoreA;
      });
    } else if (this.data.selectedSort === 'distance') {
      // 离我最近：如果有距离数据则按距离排序，否则按评分排序
      filtered.sort((a, b) => {
        const distanceA = a.distance ? parseFloat(a.distance) : 99999;
        const distanceB = b.distance ? parseFloat(b.distance) : 99999;
        return distanceA - distanceB;
      });
    }

    this.setData({
      filteredScripts: filtered
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
    wx.navigateTo({
      url: '/pages/create-room/create-room'
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

  // 显示城市选择器
  showCitySelector() {
    this.setData({
      showCityModal: true,
      isDistrictMode: false
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

  // 查看剧本详情
  viewScriptDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/script-detail/script-detail?id=${id}`
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

  // 跳转到剧本详情页面
  goToScriptDetail(e) {
    const scriptId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/script-detail/script-detail?id=${scriptId}`
    });
  },

  // 确认加入房间
  confirmJoinRoom(e) {
    const roomId = e.currentTarget.dataset.id;
    this.joinRoom(roomId);
  },

  // 加入房间
  joinRoom(roomId) {
    // 查找剧本信息
    const script = this.data.filteredScripts.length > 0
      ? this.data.filteredScripts.find(s => s.id === roomId)
      : this.data.recommendScripts.find(s => s.id === roomId);

    if (!script) {
      wx.showToast({
        title: '剧本不存在',
        icon: 'none'
      });
      return;
    }

    const app = getApp();
    const currentCoins = app.getCoins();

    // 显示确认弹窗
    wx.showModal({
      title: '确认参与拼车',
      content: `您是否确认参与拼车此剧本《${script.name}》？\n\n当前金币：${currentCoins}`,
      confirmText: '确认',
      cancelText: '取消',
      confirmColor: '#4CAF50',
      success: (res) => {
        if (res.confirm) {
          // 检查金币是否足够
          if (currentCoins < script.price) {
            wx.showModal({
              title: '金币不足',
              content: `您的金币不足！\n需要：${script.price}金币\n当前：${currentCoins}金币`,
              showCancel: false,
              confirmText: '知道了'
            });
            return;
          }

          // 扣除金币
          const success = app.reduceCoins(script.price);
          if (!success) {
            wx.showToast({
              title: '扣除金币失败',
              icon: 'none'
            });
            return;
          }

          // 用户点击确认
          wx.showLoading({ title: '加入中...' });

          setTimeout(() => {
            wx.hideLoading();

            // 保存剧本记录
            this.saveScriptRecord(script, script.price);

            // 保存交易记录
            this.saveTransaction(script.name, script.price, 'expense');

            wx.showToast({
              title: `加入成功！消耗${script.price}金币`,
              icon: 'success',
              duration: 2000
            });

            // 跳转到房间详情页
            wx.navigateTo({
              url: `/pages/room/room?roomId=${roomId}`
            });
          }, 1000);
        } else {
          // 用户点击取消
          wx.showToast({
            title: '已取消加入',
            icon: 'none'
          });
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
  }
})
