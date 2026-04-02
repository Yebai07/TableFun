// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, teamupId, playerInfo } = event
  const { OPENID } = cloud.getWXContext() // 获取调用者的真实 OpenID

  try {
    const teamupDoc = db.collection('teamups').doc(teamupId)
    
    // 1. 处理“加入”逻辑
    if (type === 'join') {
      const res = await teamupDoc.get()
      const data = res.data
      
      // 安全校验：是否已满、是否已在车上
      if (data.currentPlayers >= data.targetPlayers) {
        return { success: false, msg: '车队已满，下次早点来哦' }
      }
      if (data.joinedPlayers.some(p => p.openid === OPENID)) {
        return { success: false, msg: '你已经在车上啦' }
      }

      // 执行原子更新
      await teamupDoc.update({
        data: {
          joinedPlayers: _.push({
            ...playerInfo,
            openid: OPENID,
            isCreator: false
          }),
          currentPlayers: _.inc(1)
        }
      })
      return { success: true, msg: '上车成功' }
    }

    // 2. 处理“退出”逻辑
    if (type === 'quit') {
      const res = await teamupDoc.get()
      const data = res.data
      const playerIndex = data.joinedPlayers.findIndex(p => p.openid === OPENID)

      if (playerIndex === -1) return { success: false, msg: '你不在车上' }

      const isQuittingCreator = data.joinedPlayers[playerIndex].isCreator

      // 情况 A：车上只有一个人，直接删除这辆车（解散）
      if (data.joinedPlayers.length === 1) {
        await teamupDoc.remove()
        return { success: true, msg: '人数归零，组局已解散' }
      }

      // 情况 B：车长退出，且车上还有其他人，进行移交
      if (isQuittingCreator) {
        // 让第二个人（索引1）变成新车长
        data.joinedPlayers[1].isCreator = true
        // 移除原车长（索引0）
        data.joinedPlayers.shift()
        
        await teamupDoc.update({
          data: {
            joinedPlayers: data.joinedPlayers,
            currentPlayers: _.inc(-1)
          }
        })
        return { success: true, msg: '你已下车，车长已移交给队友' }
      }

      // 情况 C：普通队员退出，正常减员
      await teamupDoc.update({
        data: {
          joinedPlayers: _.pull({ openid: OPENID }),
          currentPlayers: _.inc(-1)
        }
      })
      return { success: true, msg: '已成功退出' }
    }

  } catch (e) {
    console.error(e)
    return { success: false, msg: '服务器操作失败', error: e }
  }
}