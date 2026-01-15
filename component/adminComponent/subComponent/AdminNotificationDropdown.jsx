import React, { useState, useEffect, useRef } from 'react';

import { X, ChevronRight, UserPlus,FileEdit,FilePlus } from 'lucide-react';
import * as utils from '../../../utils/getUserSessionStatusAndInitials';
import '../../../css/adminDashboard.css';
import { getInitials } from '../../../utils/getUserSessionStatusAndInitials';



const AdminNotificationDropdown =  ({ requests = [], newUsers = [], systemNotifications = [], sessions = [], isOpen, onClose, onReview }) => {
  if (!isOpen) return null;

  // Combine all types of notifications into a single list sorted by date
  const combinedNotifications = [
    ...requests.map(req => ({
      type: 'request',
      data: req,
      date: new Date(req.requestedAt),
      id: `req-${req.requestedAt}-${req.user?._id}`
    })),
    ...newUsers.map(user => ({
      type: 'newUser',
      data: user,
      date: new Date(user.createdAt),
      id: `user-${user._id}`
    })),
    ...systemNotifications.map(note => ({
      type: 'system',
      data: note,
      date: new Date(note.createdAt),
      id: `sys-${note._id || note.createdAt}`
    }))
  ].sort((a, b) => b.date - a.date);

  return (
    <div className="notif-dropdown">
      <div className="notif-header">
        <span>Admin Updates</span>
        <button onClick={onClose} style={{background:'none', border:'none', color:'#888', cursor:'pointer'}}><X size={16}/></button>
      </div>
      <div className="notif-list">
        {combinedNotifications.length > 0 ? (
          combinedNotifications.map((item) => {
            // 1. Access Request
            if (item.type === 'request') {
              const req = item.data;
              const session = sessions.find(s => s._id === req.sessionId); // Find session
              const sessionTitle = session ? `Day ${session.dayNumber}: ${session.title}` : 'Unknown Session'; // Format title

              return (
                <div key={item.id} className="notif-item unread" onClick={() => { if(onReview && req.user) onReview(req.user); onClose(); }} style={{cursor: 'pointer'}}>
                  <div style={{width: '32px', height: '32px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700}}>
                      {utils.getInitials(req.user?.Name)}
                  </div>
                  <div className="notif-content">
                    <p className="notif-text"><strong>{req.user?.Name}</strong> requested access to <strong>{sessionTitle}</strong></p>
                    <span className="notif-time">{item.date.toLocaleString()}</span>
                  </div>
                  <ChevronRight size={16} color="#666" style={{alignSelf:'center'}}/>
                </div>
              );
            } 
            // 2. New User
            else if (item.type === 'newUser') {
              const user = item.data;
              return (
                <div key={item.id} className="notif-item" onClick={() => { if(onReview) onReview(user); onClose(); }} style={{cursor: 'pointer'}}>
                  <div style={{width: '32px', height: '32px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <UserPlus size={16} />
                  </div>
                  <div className="notif-content">
                    <p className="notif-text">New User: <strong>{user.Name}</strong></p>
                    <span className="notif-time">{item.date.toLocaleString()}</span>
                  </div>
                </div>
              );
            } 
            // 3. System Events (Session Created/Updated)
            else {
              const note = item.data;
              const isUpdate = note.message?.toLowerCase().includes('update');
              return (
                <div key={item.id} className="notif-item">
                  <div style={{width: '32px', height: '32px', background: 'rgba(255, 255, 255, 0.05)', color: '#ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {isUpdate ? <FileEdit size={16}/> : <FilePlus size={16} />}
                  </div>
                  <div className="notif-content">
                    <p className="notif-text">{note.message}</p>
                    <span className="notif-time">{item.date.toLocaleString()}</span>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div className="empty-state">No pending updates</div>
        )}
      </div>
    </div>
  );
};
export default AdminNotificationDropdown;