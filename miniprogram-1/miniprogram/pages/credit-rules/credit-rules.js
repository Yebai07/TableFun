// pages/credit-rules/credit-rules.js
Page({
  data: {
    rules: [
      {
        icon: '★',
        title: '初始信用分',
        desc: '新用户注册即可获得',
        score: '+800',
        type: 'positive'
      },
      {
        icon: '+',
        title: '按时参加组局',
        desc: '按时参加并完成组局',
        score: '+20',
        type: 'positive'
      },
      {
        icon: '-',
        title: '锁车后跳车',
        desc: '组局已锁车后强制退出',
        score: '-100',
        type: 'negative'
      },
      {
        icon: '!',
        title: '信用分限制',
        desc: '低于600分将限制组局功能',
        score: '限制',
        type: 'warning'
      }
    ]
  }
})
