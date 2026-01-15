
import React from 'react';

import'../../css/dashboard.css';

import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
// --- TOAST COMPONENT ---
export const Toast = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="toast-container">
      <div className="toast">
        <Bell className="toast-icon" size={20} />
        <div className="toast-content">{message}</div>
        <button onClick={onClose} className="toast-close"><X size={14}/></button>
      </div>
    </div>
  );
};

export const AdminToast = ({ message, type = 'info', visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className={`toast-container`}>
      <div className={`toast toast-${type}`}>
        {type === 'success' ? <CheckCircle className="toast-icon" size={20} /> :
         type === 'error' ? <AlertCircle className="toast-icon" size={20} /> :
         <Info className="toast-icon" size={20} />}
        <div className="toast-content">{message}</div>
        <button onClick={onClose} className="toast-close"><X size={16}/></button>
      </div>
    </div>
  );
};