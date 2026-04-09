// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { openid, tags } = event
    
    // 查找用户
    const userResult = await db.collection('users').where({ _openid: openid }).get()
    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      }
    }
    
    const user = userResult.data[0]
    const tags_others = user.tags_others || []
    
    // 处理标签计数
    tags.forEach(tagName => {
      const existingTag = tags_others.find(tag => tag.name === tagName)
      if (existingTag) {
        existingTag.count += 1
      } else {
        tags_others.push({ name: tagName, count: 1 })
      }
    })
    
    // 更新数据库
    await db.collection('users').doc(user._id).update({
      data: {
        tags_others: tags_others
      }
    })
    
    return {
      success: true,
      message: '评价成功'
    }
  } catch (error) {
    console.error('更新标签失败', error)
    return {
      success: false,
      message: '评价失败，请重试',
      error: error.message
    }
  }
}
