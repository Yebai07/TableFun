/**
 * utils.js - 公共工具函数
 * 统一维护锁车计算等复用逻辑，避免多处代码重复
 */

/**
 * 计算单条组局的锁车状态文本与 isLocked 标志
 * @param {Object} item - teamup 数据对象，需含 startTime / lockHours / lockWhenFull / currentPlayers / targetPlayers
 * @returns {{ isLocked: boolean, lockStatusText: string }}
 */
function calcLockStatus(item) {
  const now = Date.now();
  const startTimestamp = new Date(item.startTime.replace(/-/g, '/')).getTime();
  const isFull = item.currentPlayers >= item.targetPlayers;

  // 优先判定：人满即锁
  if (item.lockWhenFull && isFull) {
    return { isLocked: true, lockStatusText: '已满员锁车' };
  }

  const hours = item.lockHours || 0;
  const deadline = startTimestamp - hours * 3600000;
  const diff = deadline - now;

  if (hours === 0 && now < startTimestamp) {
    return { isLocked: false, lockStatusText: '招募中' };
  }
  if (diff <= 0 || now >= startTimestamp) {
    return { isLocked: true, lockStatusText: '已锁车' };
  }

  // 倒计时
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  let lockStatusText;
  if (h > 24) {
    lockStatusText = `距锁定还有${Math.floor(h / 24)}天`;
  } else if (h > 0) {
    lockStatusText = `距锁定还有${h}小时${m}分`;
  } else {
    lockStatusText = `距锁定还有${m}分`;
  }
  return { isLocked: false, lockStatusText };
}

/**
 * 批量计算列表中每条组局的锁车状态（修改原对象并返回）
 * @param {Array} list
 * @returns {Array}
 */
function calcLockStatusList(list) {
  return list.map(item => {
    const { isLocked, lockStatusText } = calcLockStatus(item);
    item.isLocked = isLocked;
    item.lockStatusText = lockStatusText;
    return item;
  });
}

module.exports = { calcLockStatus, calcLockStatusList };
