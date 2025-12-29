
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import '../../../css/adminDashboard.css';
export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal" style={{maxWidth: 400}}>
        <div className="modal-header">
          <div style={{display:'flex', alignItems:'center', gap: 10}}>
             <div style={{background: 'rgba(239, 68, 68, 0.1)', padding: 8, borderRadius: '50%'}}>
               <AlertTriangle size={24} color="#ef4444" />
             </div>
             <h3>{title}</h3>
          </div>
          <button onClick={onCancel} className="close-btn"><X/></button>
        </div>
        <p style={{color: '#aaa', lineHeight: 1.5, marginBottom: 24}}>{message}</p>
        <div style={{display:'flex', gap:12}}>
          <button onClick={onCancel} className="btn btn-outline full-width">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger full-width">Confirm</button>
        </div>
      </div>
    </div>
  );
};