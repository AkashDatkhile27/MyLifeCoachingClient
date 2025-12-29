const generateSystemNotifications = (currentSessions, joinedDate) => {
  if (!joinedDate) return [];
  const now = new Date();
  const joined = new Date(joinedDate);
  
  // Create separate date objects for midnight calculations to avoid mutating 'now'
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  
  const joinedMidnight = new Date(joined);
  joinedMidnight.setHours(0, 0, 0, 0);
  
  const dayIndex = Math.floor((todayMidnight - joinedMidnight) / (1000 * 60 * 60 * 24)) + 1;

  const sysNotifs = [];

  // 1. Unlock Notification
  const todaySession = currentSessions.find(s => s.dayNumber === dayIndex);
  if (todaySession && !todaySession.isCompleted) {
    sysNotifs.push({
      type: 'info',
      message: `Day ${dayIndex}: "${todaySession.title}" is now unlocked!`,
      read: false,
      createdAt: now.toISOString()
    });
  }

  // 2. Expiry Notification (Standard 24h)
  currentSessions.forEach(s => {
      const unlockDate = new Date(joined);
      unlockDate.setDate(joined.getDate() + (s.dayNumber - 1));
      unlockDate.setHours(0,0,0,0);
      
      const expireDate = new Date(unlockDate.getTime() + 24 * 60 * 60 * 1000); 
      
      const hoursLeft = (expireDate - now) / (1000 * 60 * 60);
      
      if (hoursLeft > 0 && hoursLeft <= 4 && !s.isCompleted && !s.hasSpecialAccess) {
        sysNotifs.push({
          type: 'warning',
          message: `Day ${s.dayNumber}: "${s.title}" expires in ${Math.ceil(hoursLeft)} hours!`,
          read: false,
          createdAt: now.toISOString()
        });
      }
  });
// 3. Special Access Expiry Notification (< 30 mins)
  currentSessions.forEach(s => {
    if (s.hasSpecialAccess && s.specialAccessExpiresAt && !s.isCompleted) {
      const specialExpire = new Date(s.specialAccessExpiresAt);
      const diffMins = (specialExpire - now) / (1000 * 60);
      
      // *** HIGHLIGHT: Notify users during the 30-minute Special Access window ***
      if (diffMins > 0 && diffMins <= 30) {
        sysNotifs.push({
          type: 'warning',
          message: `Special Access for "${s.title}" expires in ${Math.ceil(diffMins)} minutes!`,
          read: false,
          createdAt: now.toISOString()
        });
      }
    }
  });

  return sysNotifs;
}
export default generateSystemNotifications;