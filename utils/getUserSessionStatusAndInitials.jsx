import React from 'react';
// --- HELPER UTILS ---
export const getSessionStatus =(user, session) => {
    // 0. Admin Override
    if (user.role === 'admin' || user.role === 'superadmin') {
        return 'active';
    }
 // 1. Check Special Access FIRST (Priority)
    // Using String() conversion to ensure robust ID matching (ObjectId vs String)
    const special = user.specialAccess?.find(sa => String(sa.sessionId) === String(session._id));
    if (special) {
       const now = new Date();
       const expires = new Date(special.expiresAt);
       if (expires > now) return 'granted';
       // If expired, fall through to check completion/locks
    }

    // 2. Completed?
    if (user.completedSessions?.includes(session._id)) return 'completed';

    // 3. Time-based Logic
    const today = new Date(); 
    today.setHours(0,0,0,0);
    const joined = new Date(user.createdAt); 
    joined.setHours(0,0,0,0);
    
    const unlockDate = new Date(joined);
    unlockDate.setDate(unlockDate.getDate() + (session.dayNumber - 1));
    
    const expiryDate = new Date(unlockDate);
    expiryDate.setDate(expiryDate.getDate() + 1);

    if (today < unlockDate) return 'locked';
    if (today >= expiryDate) return 'expired';
    return 'active';
  }




export const getInitials = (name) => {
  if (!name) return '';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}