// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { type, teamupId, playerInfo, targetOpenid } = event;
  const { OPENID } = cloud.getWXContext();

  try {
    const teamupDoc = db.collection('teamups').doc(teamupId);

    // ── 1. 加入 ──────────────────────────────────────────
    if (type === 'join') {
      const res = await teamupDoc.get();
      const data = res.data;

      if (data.currentPlayers >= data.targetPlayers) {
        return { success: false, msg: '车队已满，下次早点来哦' };
      }
      if (data.joinedPlayers.some(p => p.openid === OPENID)) {
        return { success: false, msg: '你已经在车上啦' };
      }

      await teamupDoc.update({
        data: {
          joinedPlayers: _.push({ ...playerInfo, openid: OPENID, isCreator: false }),
          currentPlayers: _.inc(1)
        }
      });
      return { success: true, msg: '上车成功' };
    }

    // ── 2. 退出 ──────────────────────────────────────────
    if (type === 'quit') {
      const res = await teamupDoc.get();
      const data = res.data;
      const playerIndex = data.joinedPlayers.findIndex(p => p.openid === OPENID);
      
      if (playerIndex === -1) return { success: false, msg: '你不在车上' };

      // 计算是否锁车
      const now = Date.now();
      const startTimestamp = new Date(data.startTime.replace(/-/g, '/')).getTime();
      const lockHours = data.lockHours || 0;
      const deadline = startTimestamp - lockHours * 3600000;
      const isLocked = (lockHours > 0 && now >= deadline) || now >= startTimestamp ||
                       (data.lockWhenFull && data.currentPlayers >= data.targetPlayers);

      // 🚀 核心修复 1：只有锁车了，【并且车上不止一个人】，才扣除信用分
      const shouldDeductScore = isLocked && data.joinedPlayers.length > 1;

// 🚀 核心修复：更新总分并写入明细流水
if (shouldDeductScore) {
  try {
    // 1. 先查出该用户的当前数据，为了拿到当前分数和历史流水
    const userRes = await db.collection('users').where({ _openid: OPENID }).get();
    
    if (userRes.data && userRes.data.length > 0) {
      const userDoc = userRes.data[0];
      const currentScore = userDoc.creditScore !== undefined ? userDoc.creditScore : 800;
      const newScore = currentScore - 50; // 计算扣除后的最新分

      // 2. 获取现有的流水记录。如果以前没记录过，就把“初始分”作为兜底放进去
      const existingRecords = userDoc.creditRecords || [{
        id: 'init_1', 
        type: 'init', 
        title: '初始信用分', 
        change: '+800', 
        score: 800, 
        time: '注册时', 
        description: '新用户注册获得初始信用分'
      }];

      // 3. 构造本次违规跳车的新流水（动态获取北京时间）
      const now = new Date();
      const timeStr = new Date(now.getTime() + 8 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16);

      const newRecord = {
        id: Date.now().toString(),
        type: 'penalty',
        title: '违规跳车',
        change: '-50',
        score: newScore,
        time: timeStr,
        description: `从《${data.scriptTitle || '未知剧本'}》锁车后强行退出` // 动态写入剧本名，体验拉满！
      };

      // 4. 将新流水插在最前面（最新的排在最上面）
      const updatedRecords = [newRecord, ...existingRecords];

      // 5. 最终：把计算好的新分数和流水数组，一次性更新进数据库
      await db.collection('users').where({ _openid: OPENID }).update({
        data: { 
          creditScore: newScore,
          creditRecords: updatedRecords 
        }
      });
    }
  } catch (err) {
    console.error('信用分流水写入失败:', err);
  }
}

      // 情况 A：只剩一人，直接解散
      if (data.joinedPlayers.length === 1) {
        await teamupDoc.remove();
        // 因为只有一个人，shouldDeductScore 为 false，所以不会扣分
        return { success: true, isDisbanded: true, msg: '组局已解散' };
      }

      // 情况 B：车长退出（且车上还有别人）
      const isQuittingCreator = data.joinedPlayers[playerIndex].isCreator;
      if (isQuittingCreator) {
        const nextIndex = data.joinedPlayers.findIndex((p, i) => i !== playerIndex);
        data.joinedPlayers[nextIndex].isCreator = true;
        data.joinedPlayers.splice(playerIndex, 1);
        
        await teamupDoc.update({
          data: { joinedPlayers: data.joinedPlayers, currentPlayers: _.inc(-1) }
        });
        
        return {
          success: true,
          msg: shouldDeductScore ? '已锁车跳车，信用分 -50，车长已移交' : '你已下车，车长已移交给队友'
        };
      }

      // 情况 C：普通队员退出
      await teamupDoc.update({
        data: { joinedPlayers: _.pull({ openid: OPENID }), currentPlayers: _.inc(-1) }
      });
      
      return {
        success: true,
        msg: shouldDeductScore ? '已锁车跳车，信用分 -50' : '已成功退出'
      };
    }

    // ── 3. 踢人（仅车长可用）─────────────────────────────
    if (type === 'kick') {
      const res = await teamupDoc.get();
      const data = res.data;

      // 校验操作者是否为车长
      const caller = data.joinedPlayers.find(p => p.openid === OPENID);
      if (!caller || !caller.isCreator) {
        return { success: false, msg: '只有车长才能踢人' };
      }
      if (targetOpenid === OPENID) {
        return { success: false, msg: '不能踢自己' };
      }
      const targetIndex = data.joinedPlayers.findIndex(p => p.openid === targetOpenid);
      if (targetIndex === -1) {
        return { success: false, msg: '该玩家不在车上' };
      }

      // 🚀 核心修复 2：彻底删掉踢人扣分的逻辑！被踢是被动行为，不需要扣分。
      
      await teamupDoc.update({
        data: {
          joinedPlayers: _.pull({ openid: targetOpenid }),
          currentPlayers: _.inc(-1)
        }
      });
      
      // 这里的提示语也回归正常
      return { success: true, msg: '已将该玩家请出队伍' };
    }

  } catch (e) {
    console.error(e);
    return { success: false, msg: '服务器操作失败', error: e };
  }
};