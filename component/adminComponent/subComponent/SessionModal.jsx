import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../../css/adminDashboard.css';

const SessionModal = ({ isOpen, onClose, session, onSave }) => {
  const [form, setForm] = useState({ dayNumber: '', title: '', type: 'Recorded', mediaUrl: '', contextPoints: '' });
  
  useEffect(() => {
    if (session) setForm({ ...session, contextPoints: session.contextPoints?.join('\n') || '' });
    else setForm({ dayNumber: '', title: '', type: 'Recorded', mediaUrl: '', contextPoints: '' });
  }, [session, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{session ? 'Edit Session' : 'New Session'}</h3>
          <button onClick={onClose} className="close-btn"><X/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <div className="form-row">
            <input className="input" type="number" placeholder="Day #" required style={{flex:1}} value={form.dayNumber} onChange={e => setForm({...form, dayNumber: e.target.value})} />
            <select className="input" style={{flex:2}} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="Recorded">Recorded</option>
              <option value="One:One">One on One</option>
              <option value="Reading">Reading</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
          <input className="input" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          {form.type === 'Recorded' && (
            <input className="input" placeholder="YouTube Embed URL" value={form.mediaUrl} onChange={e => setForm({...form, mediaUrl: e.target.value})} />
          )}
          <textarea className="input textarea" placeholder="Context Points (Line separated)" value={form.contextPoints} onChange={e => setForm({...form, contextPoints: e.target.value})} />
          <button type="submit" className="btn btn-primary full-width">Save Session</button>
        </form>
      </div>
    </div>
  );
};

export default SessionModal
