// cloudfunctions/updateUserTags/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { targetOpenid, tags } = event
  const { OPENID } = cloud.getWXContext() // 获取评价人的真实身份

  // 1. 云端物理防线：绝对禁止自导自演
  if (targetOpenid === OPENID) {
    return { success: false, msg: '系统拦截：不能给自己贴标签哦' }
  }

  try {
    // 2. 双重兼容查询：寻找被评价的人
    const userRes = await db.collection('users').where(_.or([
      { _openid: targetOpenid },
      { openid: targetOpenid }
    ])).get()

    if (!userRes.data || userRes.data.length === 0) {
      return { success: false, msg: '未找到该玩家的档案' }
    }

    const user = userRes.data[0]
    let tags_others = user.tags_others || []

    // 3. 核心计算：有则 count+1，无则新增
    tags.forEach(tagName => {
      let existingTag = tags_others.find(t => t.name === tagName)
      if (existingTag) {
        existingTag.count += 1
      } else {
        tags_others.push({ name: tagName, count: 1 })
      }
    })

    // 4. 写回数据库
    await db.collection('users').doc(user._id).update({
      data: { tags_others: tags_others }
    })

    return { success: true, msg: '评价成功！' }

  } catch (error) {
    console.error('评价写入失败:', error)
    return { success: false, msg: '服务器开小差了，请重试' }
  }
}