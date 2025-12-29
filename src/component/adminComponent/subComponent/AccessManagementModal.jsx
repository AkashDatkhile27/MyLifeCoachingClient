import React from 'react'
import { X } from 'lucide-react';
import '../../../css/adminDashboard.css';

import { Check } from 'lucide-react';
import * as utils from '../../../utils/getUserSessionStatusAndInitials'
const AccessManagementModal =  ({ isOpen, onClose, user, sessions, onGrant }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Manage Access</h3>
            <p style={{fontSize:'0.85rem', color:'#888', margin:0}}>User: {user.Name}</p>
          </div>
          <button onClick={onClose} className="close-btn"><X/></button>
        </div>
        
        <div className="access-list">
          {sessions.map(s => {
            // Check for pending request for THIS specific session
            const requests = user.accessRequests?.filter(r => r.sessionId === s._id) || [];
            const isPending = requests.some(r => r.status === 'pending');
            const reqCount = requests.length;
            const isLimitReached = reqCount >= 3;

            // Determine status but force 'pending' for UI if a request exists
            let status = utils.getSessionStatus(user, s);
            if (isPending) status = 'pending';

            return (
              <div key={s._id} className="access-item" 
                   // *** HIGHLIGHT: Conditionally style white background for pending request ***
                   style={status === 'pending' ? {background: '#ffffff', borderColor: '#e5e5e5'} : {}}>
                <div className="access-info">
                  <div style={{
                      // *** HIGHLIGHT: Invert text colors for white background ***
                      background: status === 'pending' ? '#000' : '#333', 
                      padding:'4px 8px', borderRadius:6, fontSize:'0.75rem', fontWeight:'bold', color:'#fff'
                  }}>Day {s.dayNumber}</div>
                  <div>
                    <div className="access-title" style={status === 'pending' ? {color: '#000'} : {}}>{s.title}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'4px'}}>
                      <span className={`status-badge ${status}`}>{status}</span>
                      {status !== 'unlocked' && (
                        <span style={{fontSize:'0.7rem', color: status === 'pending' ? '#666' : (isLimitReached ? '#ef4444' : '#666')}}>
                           Requests: {reqCount}/3
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{display:'flex', gap:'8px'}}>
                  {status === 'unlocked' ? (
                    <span style={{fontSize:'0.75rem', color:'#64748b', alignSelf:'center', fontStyle:'italic'}}>Full Access</span>
                  ) : status === 'pending' ? (
                    <>
                      <button onClick={() => onGrant(s._id, true)} className="btn btn-sm btn-primary" title="Approve" style={{boxShadow: '0 2px 5px rgba(0,0,0,0.2)'}}><Check size={14}/> Approve</button>
                      <button onClick={() => onGrant(s._id, false)} className="btn btn-sm btn-danger" title="Reject"><X size={14}/></button>
                    </>
                  ) : status === 'granted' ? (
                    <button onClick={() => onGrant(s._id, false)} className="btn btn-sm btn-danger">Revoke</button>
                  ) : (
                    <button onClick={() => onGrant(s._id, true)} className="btn btn-sm btn-outline" style={status === 'pending' ? {color: '#000', borderColor: '#ccc'} : {}}>Grant 24h</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccessManagementModal
