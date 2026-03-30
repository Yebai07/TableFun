// pages/participated-scripts/participated-scripts.js
Page({
  data: {
    isLoading: true,
    scripts: []
  },

  onLoad() {
    this.fetchParticipatedScripts();
  },

  fetchParticipatedScripts() {
    this.setData({ isLoading: true });
    // 获取当前用户openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'getOpenId' },
      success: (res) => {
        const openid = res.result && res.result.openid;
        if (!openid) {
          this.setData({ isLoading: false, scripts: [] });
          return;
        }

        const db = wx.cloud.database();
        // 假设有一个 collections: participations，记录用户参与的剧本关联
        db.collection('participations').where({
          _openid: openid
        }).get({
          success: (r) => {
            const items = (r.data || []).map((p) => {
              // 如果参与记录中包含剧本信息，使用之；否则需要额外查询剧本表
              return {
                _id: p._id || p.scriptId,
                title: p.title || p.scriptTitle || '未命名剧本',
                joinedAt: p.joinedAt || p.createTime || Date.now()
              };
            });
            this.setData({ scripts: items, isLoading: false });
          },
          fail: (err) => {
            console.error('查询参与记录失败', err);
            this.setData({ isLoading: false, scripts: [] });
          }
        });
      },
      fail: (err) => {
        console.error('获取openid失败', err);
        this.setData({ isLoading: false, scripts: [] });
      }
    });
  },

  openScriptDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    // 这里跳转到已有的剧本详情页（假设为pages/detail/detail）
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
});

