// pages/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },
  /**
   * 分享给好友/群聊
   */
  onShareAppMessage() {
    return {
      title: `【还差${this.data.emptySlots.length}人】快来拼车《${this.data.teamup.scriptTitle}》！`,
      path: `/pages/teamup-detail/teamup-detail?id=${this.data.teamupId}`,
      imageUrl: this.data.teamup.bannerUrl // 用剧本封面做分享图
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: `快来拼《${this.data.teamup.scriptTitle}》，就等你了！`,
      query: `id=${this.data.teamupId}`
    }
  }
})