// pages/participated-scripts/participated-scripts.js
Page({
  data: {
    isLoading: true,
    scripts: []
  },

  onLoad() {
    this.fetchParticipatedScripts();
  },

  // 主方法：先拿到参与记录，再批量查询对应剧本详情，合并后更新页面
  fetchParticipatedScripts() {
    this.setData({ isLoading: true });

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

        // 1) 查询 participations 集合，获取用户的参与记录
        db.collection('participations').where({
          _openid: openid
        }).get().then((r) => {
          const participations = r.data || [];

          if (participations.length === 0) {
            this.setData({ scripts: [], isLoading: false });
            return;
          }

          // 2) 收集所有 scriptId，用于批量查询 scripts 表
          const scriptIds = participations.map(p => p.scriptId).filter(Boolean);

          if (scriptIds.length === 0) {
            // 参与记录本身包含标题或最少信息
            const items = participations.map(p => this._buildItemFromParticipation(p));
            this.setData({ scripts: items, isLoading: false });
            return;
          }

          // 使用 db.command.in 批量查询
          const _ = db.command;
          db.collection('scripts').where({ _id: _.in(scriptIds) }).get().then((sr) => {
            const scriptsById = (sr.data || []).reduce((acc, s) => {
              acc[s._id] = s; return acc;
            }, {});

            // 合并参与记录和剧本信息
            const items = participations.map(p => {
              const script = scriptsById[p.scriptId] || {};
              return this._buildItemFromParticipation(p, script);
            });

            // 根据参与时间降序
            items.sort((a, b) => (b.joinedAtRaw || 0) - (a.joinedAtRaw || 0));

            this.setData({ scripts: items, isLoading: false });
          }).catch(err => {
            console.error('查询 scripts 失败', err);
            const items = participations.map(p => this._buildItemFromParticipation(p));
            this.setData({ scripts: items, isLoading: false });
          });

        }).catch(err => {
          console.error('查询 participations 失败', err);
          this.setData({ isLoading: false, scripts: [] });
        });

      },
      fail: (err) => {
        console.error('获取openid失败', err);
        this.setData({ isLoading: false, scripts: [] });
      }
    });
  },

  // 根据参与记录和（可选）剧本信息构造显示项
  _buildItemFromParticipation(participation, script) {
    // participation 期望字段：_id, scriptId, title, joinedAt, status
    const title = participation.title || (script && script.title) || '未命名剧本';
    const joinedAtRaw = participation.joinedAt || participation.createTime || participation.joinedAtRaw || Date.now();
    const joinedAt = this._formatDate(joinedAtRaw);
    // status 可能是 'started'（已开车/已开始） 或 'forming'（组队中） 或其他
    const status = participation.status || (script && script.status) || 'forming';
    const statusText = status === 'started' ? '已开车' : (status === 'forming' ? '组队中' : status);

    return {
      _id: participation.scriptId || participation._id || (script && script._id) || '',
      title,
      joinedAt,
      joinedAtRaw,
      status,
      statusText,
      // 可展示的额外字段：作者、最小/当前人数、封面等
      author: (script && script.authorName) || (script && script.author) || '',
      playerCount: (script && script.playerCount) || script && script.currentPlayers || participation.playerCount || 0
    };
  },

  _formatDate(ts) {
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch (e) {
      return '' + ts;
    }
  },

  openScriptDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
});

