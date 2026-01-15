import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../../../css/adminDashboard.css';
const CreateAdminModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Create Admin</h3>
          <button onClick={onClose} className="close-btn"><X/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); setForm({name:'',email:'',password:'',phone:''}); }}>
          <input className="input" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="input" placeholder="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="input" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <button type="submit" className="btn btn-primary full-width">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal
