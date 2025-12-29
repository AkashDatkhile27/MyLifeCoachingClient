import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield, Users, Trash2, AlertCircle } from 'lucide-react';
import { getInitials } from '../../../utils/getUserSessionStatusAndInitials';
import '../../../css/adminDashboard.css';

const UserManagementTab = ({ users, sessions, onManage, onDelete, onCreateAdmin }) => (
  <div className="sa-grid">
    {/* Add Admin Card */}
    <div onClick={onCreateAdmin} className="sa-card" style={{justifyContent:'center', alignItems:'center', cursor:'pointer', borderStyle:'dashed', background:'transparent', borderColor:'#444'}}>
       <div style={{background:'#333', borderRadius:'50%', padding:12}}><Plus size={24} color="#888"/></div>
       <span style={{fontWeight:600, color:'#888', marginTop:12}}>Add New Admin</span>
    </div>

    {users.map((user) => {
      const completed = user.completedSessions?.length || 0;
      const total = sessions.length || 15;
      const progress = Math.min(100, (completed / total) * 100);
      
      // Strict check for accessRequests array
      const pendingRequests = Array.isArray(user.accessRequests) 
        ? user.accessRequests.filter(r => r.status === 'pending').length 
        : 0;

      return (
        <div key={user._id} className="sa-card">
          <div className="card-header-row">
             <div className="user-info" style={{display:'flex'}}>
                <div className="avatar-initials">{getInitials(user.Name)}</div>
                <div>
                  <h3>{user.Name}</h3>
                  <p>{user.email}</p>
                </div>
             </div>
             <span className={`role-badge ${user.role}`}>
                {user.role === 'superadmin' ? <Shield size={10}/> : <Users size={10}/>}
                {user.role}
             </span>
          </div>

          <div className="progress-section">
             <div className="stat-row">
                <span>Progress</span>
                <span>{completed}/{total}</span>
             </div>
             <div className="progress-track">
                <div className="progress-fill" style={{width: `${progress}%`}}></div>
             </div>
          </div>

          {pendingRequests > 0 && (
              <div style={{background:'rgba(250, 204, 21, 0.15)', color:'#facc15', padding:'8px', borderRadius:'6px', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'6px', border:'1px solid rgba(250, 204, 21, 0.2)'}}>
                  <AlertCircle size={14}/> {pendingRequests} Access Request(s)
              </div>
          )}

          {user.role !== 'superadmin' && (
            <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
              <button onClick={() => onManage(user)} className="btn btn-primary btn-sm" style={{flex:1}}>
                 {pendingRequests > 0 ? 'Review Requests' : 'Manage Access'}
              </button>
              <button onClick={() => onDelete(user._id)} className="btn btn-danger btn-sm"><Trash2 size={16}/></button>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default UserManagementTab
