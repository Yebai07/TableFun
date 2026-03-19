// components/custom-navbar/custom-navbar.js
Component({
  properties: {
    // 城市名称
    city: {
      type: String,
      value: '北京'
    },
    // 是否显示返回键
    showBack: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 20,
    navBarHeight: 44
  },

  lifetimes: {
    attached() {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      // 计算导航栏高度：状态栏高度 + 胶囊按钮底部到状态栏的间距
      // 导航栏顶部从0开始，底部略低于胶囊按钮底部（加10px间距）
      const navBarHeight = menuButtonInfo.top + menuButtonInfo.height - statusBarHeight + 10;

      this.setData({
        statusBarHeight,
        navBarHeight
      });
    }
  },

  methods: {
    onCityTap() {
      this.triggerEvent('citytap');
    },
    onBackTap() {
      this.triggerEvent('backtap');
    }
  }
});
