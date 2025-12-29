  import React, { useState, useEffect } from 'react';
  import { 
    BookOpen, 
    User, 
    Lock, 
    Unlock, 
    PlayCircle, 
    Edit3, 
    Clock, 
    CheckCircle,

    ChevronRight,
  
    Timer,

  } from 'lucide-react';
  import {SpecialCountdownTimer,CountdownTimer,GetUnlockDate} from '../../utils/TimerHelper';



  const UserSession = ({ session, userCreatedAt, onRequestAccess, onOpenReflection, onStartSession }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30 * 60 * 1000); return () => clearInterval(t); }, []);

   // *** HIGHLIGHT: Auto-lock trigger for Special Access ***
  useEffect(() => {
    if (session.hasSpecialAccess && session.specialAccessExpiresAt) {
      const expireTime = new Date(session.specialAccessExpiresAt).getTime();
      const timeRemaining = expireTime - new Date().getTime();

      if (timeRemaining > 0) {
        // Schedule a refresh exactly when the timer hits 0
        const timer = setTimeout(() => {
          setNow(new Date());
        }, timeRemaining + 500); // 500ms buffer to ensure it counts as expired
        return () => clearTimeout(timer);
      }
    }
  }, [session.hasSpecialAccess, session.specialAccessExpiresAt]);
  
  const unlockDate = GetUnlockDate(userCreatedAt, session.dayNumber) || new Date();
  
  // Revert Standard Expiry to 24 Hours
  const standardExpire = new Date(unlockDate.getTime() + 24 * 60 * 60 * 1000); 
  
  const specialExpire = session.specialAccessExpiresAt ? new Date(session.specialAccessExpiresAt) : null;

  // *** HIGHLIGHT: Special Access Automatic Removal Logic ***
  // Access is granted ONLY if the current time (now) is before the expiration time.
  // Once 'now' passes 'specialExpire' (30 mins after grant), this becomes false, removing access.
  const isSpecialActive = session.hasSpecialAccess && specialExpire && now < specialExpire;
  const isCompleted = session.isCompleted;
  
  const isExpired = !isSpecialActive && (
      isCompleted || 
      (session.hasSpecialAccess && now > specialExpire) || 
      (!session.hasSpecialAccess && now > standardExpire)
  );
  
  const isLocked = !isSpecialActive && (now < unlockDate || isExpired);

  const requestLimit = 3;
  const currentAccessCount = session.specialAccessCount || 0;
  const isRequestPending = session.accessRequestStatus === 'pending';
  const canRequestAccess = currentAccessCount < requestLimit && !isRequestPending;
  const isRecordedSession = session.type === 'Recorded';
  const unlockDateString = unlockDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  let stateClass = "active";
  if (isCompleted) stateClass = "completed";
  else if (isSpecialActive) stateClass = "active";
  else if (isLocked) stateClass = "locked";

  return (
    <div className="session-list-item">
      <div className="timeline-marker-col">
        <div className={`day-circle ${stateClass}`}>
          <span>Day</span><span>{session.dayNumber}</span>
        </div>
      </div>
      <div className={`session-content-card ${stateClass}`}>
        <div className="card-top-row">
            <div>
              <h3 className={`session-title ${isLocked ? 'locked' : ''}`}>{session.title}</h3>
              <div className="meta-row">
                <div className="meta-item">
                  {session.type === 'Recorded' ? <PlayCircle size={14} /> : session.type === 'One:One' ? <User size={14} /> : <BookOpen size={14} />}
                  {session.type}
                </div>
                <span>•</span>
                <div className="meta-item"><Clock size={14} /> 20 mins</div>
              </div>
            </div>
            
            {isCompleted ? <div className="status-badge completed"><CheckCircle size={14} style={{marginRight:4}}/> Completed</div> :
             isSpecialActive ? (
                <div className="status-badge granted">
                    <Unlock size={12} /> 
                    <span>Special Access</span>
                    {specialExpire && <span style={{opacity:0.8, fontSize:'0.65rem', marginLeft:'2px'}}>(<CountdownTimer targetDate={specialExpire} /> )</span>}
                </div>
             ) :
             isRequestPending ? <div className="status-badge pending"><Clock size={12} style={{marginRight:4}}/> Request Pending</div> :
             isLocked ? <div className="status-badge locked"><Lock size={12} style={{marginRight:4}}/> {isExpired ? 'Missed' : 'Locked'}</div> :
             <div className="status-badge active1"><Timer size={12} style={{marginRight:4}}/> Open</div>
            }
        </div>

        <ul className="context-list">
          {session.contextPoints?.map((point, idx) => (
            <li key={idx} className={`context-item ${isLocked ? 'locked' : ''}`}>
              <span className={`bullet ${isCompleted ? 'completed' : ''}`}></span>{point}
            </li>
          ))}
        </ul>

        <div className={`card-footer ${isLocked ? 'locked' : ''}`}>
           {isLocked && isExpired ? (
               <div className="countdown-text">
                   {/* Left Side: Status */}
                   <div style={{display:'flex', alignItems:'center', gap:6}}>
                     <Lock size={14}/> 
                     {isCompleted ? "Review Locked" : "Access Expired"} 
                   </div>
                   
                   {/* Right Side: Action/Info */}
                   {isRequestPending ? 
                       <span style={{color:'#a3a3a3', fontSize:'0.75rem', fontWeight:600, border:'1px solid #333', padding:'4px 8px', borderRadius:'99px'}}>Request Pending</span> :
                       (canRequestAccess && isRecordedSession) ? 
                       <button className="btn-request" onClick={() => onRequestAccess(session._id)}>Request Access</button> :
                       <span className="limit-reached">{!isRecordedSession ? "Contact Admin" : "Limit Reached"}</span>
                   }
               </div>
           ) : !isLocked ? (
               <div style={{display:'flex', width:'100%', gap:10, flexDirection: 'row'}}>
                  <button className="btn1 btnoutline" style={{flex:1}} onClick={() => onOpenReflection(session)}><Edit3 size={16}/> Reflect</button>
                  <button className="btn1 btnprimary" style={{flex:1}} onClick={() => onStartSession(session._id)}>
                    {isCompleted ? "Review Session" : "Start Session"} <ChevronRight size={16}/>
                  </button>
               </div>
           ) : (
               <div className="countdown-text">
                   <div style={{display:'flex', gap:6, alignItems:'center'}}>
                       <Clock size={14}/> 
                       <span>Unlocks in <CountdownTimer targetDate={unlockDate} /></span>
                   </div>
                   <span style={{fontSize:'0.75rem', opacity:0.7}}>{unlockDateString}</span>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

  export default UserSession