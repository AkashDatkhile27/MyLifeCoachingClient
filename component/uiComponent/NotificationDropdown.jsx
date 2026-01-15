import React from 'react'

import { X, CheckCircle, ShieldAlert, Info } from 'lucide-react';
const NotificationDropdown = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <span>Notifications</span>
        <button onClick={onClose} style={{background:'none', border:'none', color:'#888', cursor:'pointer'}}><X size={16}/></button>
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div key={index} className={`notification-item ${!note.read ? 'unread' : ''}`}>
              <div className="notification-icon">
                {note.type === 'success' ? <CheckCircle size={16} color="#22c55e"/> : 
                 note.type === 'error' || note.type === 'warning' ? <ShieldAlert size={16} color="#ef4444"/> : 
                 <Info size={16} color="#3b82f6"/>}
              </div>
              <div className="notification-content">
                <p className="notification-text">{note.message}</p>
                <span className="notification-time">{new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No new notifications</div>
        )}
      </div>
    </div>
  );}

export default NotificationDropdown
