// pages/user-tags/user-tags.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    // 获取用户的openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      },
      success: (res) => {
        if (res.result && res.result.openid) {
          const openid = res.result.openid;
          // 从云数据库获取数据
          const db = wx.cloud.database();
          db.collection('users').where({
            _openid: openid
          }).get({
            success: (res) => {
              if (res.data && res.data.length > 0) {
                this.setData({
                  userInfo: res.data[0]
                });
              } else {
                // 失败时使用模拟数据
                const userInfo = {
                  _id: "2d12bec269c130f1014f6539754f4963",
                  _openid: openid,
                  avatarUrl: "/images/default-avatar.png",
                  bio: "这是我的个性签名...",
                  creditScore: 800,
                  gender: 1,
                  mbti: "ENTP",
                  nickname: "探索者",
                  tags_others: [    
                    {count: 11, name: "剧本杀大神"},
                    {count: 9, name: "人形测谎仪"},
                    {count: 5, name: "新手护航者"},
                    {count: 3, name: "复盘小能手"}
                  ],
                  tags_self: ["06", "男", "学生", "郫都区", "社交达人", "细节控", "气氛烘托者"]
                };
                this.setData({
                  userInfo: userInfo
                });
              }
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
              // 失败时使用模拟数据
              const userInfo = {
                _id: "2d12bec269c130f1014f6539754f4963",
                _openid: openid,
                avatarUrl: "/images/default-avatar.png",
                bio: "这是我的个性签名...",
                creditScore: 800,
                gender: 1,
                mbti: "ENTP",
                nickname: "探索者",
                tags_others: [    
                  {count: 11, name: "剧本杀大神"},
                  {count: 9, name: "人形测谎仪"},
                  {count: 5, name: "新手护航者"},
                  {count: 3, name: "复盘小能手"}
                ],
                tags_self: ["06", "男", "学生", "郫都区", "社交达人", "细节控", "气氛烘托者"]
              };
              this.setData({
                userInfo: userInfo
              });
            }
          });
        } else {
          console.error('获取openid失败，返回结果异常', res);
          // 使用模拟数据
          const userInfo = {
            _id: "2d12bec269c130f1014f6539754f4963",
            _openid: "用户的唯一ID",
            avatarUrl: "/images/default-avatar.png",
            bio: "这是我的个性签名...",
            creditScore: 800,
            gender: 1,
            mbti: "ENTP",
            nickname: "探索者",
            tags_others: [    
              {count: 11, name: "剧本杀大神"},
              {count: 9, name: "人形测谎仪"},
              {count: 5, name: "新手护航者"},
              {count: 3, name: "复盘小能手"}
            ],
            tags_self: ["06", "男", "学生", "郫都区", "社交达人", "细节控", "气氛烘托者"]
          };
          this.setData({
            userInfo: userInfo
          });
        }
      },
      fail: (err) => {
        console.error('获取openid失败', err);
        // 使用模拟数据
        const userInfo = {
          _id: "2d12bec269c130f1014f6539754f4963",
          _openid: "用户的唯一ID",
          avatarUrl: "/images/default-avatar.png",
          bio: "这是我的个性签名...",
          creditScore: 800,
          gender: 1,
          mbti: "ENTP",
          nickname: "探索者",
          tags_others: [    
            {count: 11, name: "剧本杀大神"},
            {count: 9, name: "人形测谎仪"},
            {count: 5, name: "新手护航者"},
            {count: 3, name: "复盘小能手"}
          ],
          tags_self: ["06", "男", "学生", "郫都区", "社交达人", "细节控", "气氛烘托者"]
        };
        this.setData({
          userInfo: userInfo
        });
      }
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 获取自己标签的样式类
   */
  getSelfTagClass(tag) {
    switch (tag) {
      case '06':
        return 'tag-orange';
      case '男':
      case '学生':
      case '社交达人':
        return 'tag-red';
      case '郫都区':
      case '细节控':
        return 'tag-purple';
      case '反串爱好者':
        return 'tag-blue';
      case '气氛烘托者':
        return 'tag-green';
      default:
        return 'tag-gray';
    }
  },

  /**
   * 获取他人标签的样式类
   */
  getOtherTagClass(tag) {
    switch (tag) {
      case '剧本杀大神':
        return 'tag-blue';
      case '人形测谎仪':
        return 'tag-purple';
      case '新手护航者':
        return 'tag-green';
      case '复盘小能手':
        return 'tag-red';
      default:
        return 'tag-gray';
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})