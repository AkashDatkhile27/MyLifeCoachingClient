import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import { Loader2, Shield, Bell } from 'lucide-react';
// --- COMPONENTS ---
// import UserNavbar from '../userComponent/userNavbar'

import { AdminToast } from '../uiComponent/Toast';
import { ConfirmationModal } from './subComponent/ConfirmationModal';
import Profile from '../CommonComponent/Profile';
import AdminNavbar from './subComponent/AdminNavbar';
import UserManagementTab from './subComponent/UserManagementTab';
import SessionManagementTab from './subComponent/SessionManagementTab';
import CreateAdminModal from './subComponent/CreateAdminModal';
import SessionModal from './subComponent/SessionModal';
import AccessManagementModal from './subComponent/AccessManagementModal';
import ReflectionTab from './subComponent/AdminReflectionsTab'
// --- CSS STYLES ---
import adminStyles from '../../css/adminDashboard.css';
// --- API SERVICE ---
import adminDashboardApiService from '../../apiServices/adminDashboardApiService';

const SuperAdminDashboard = () => {
 const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  // Tabs State
  const [activeTabProfile, setActiveTabProfile] = useState('dashboard'); // 'dashboard' or 'profile'
  // Data
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]); // System logs
  
  // UI State
  const [modals, setModals] = useState({ admin: false, session: false, access: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Derived Data: Access Requests
  const allPendingRequests = users.flatMap(u => 
      (u.accessRequests || [])
        .filter(r => r.status === 'pending')
        .map(r => ({ ...r, user: u }))
  ).sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  // Derived Data: New Users (last 7 days)
  const newUsers = users.filter(u => {
     const joined = new Date(u.createdAt);
     const now = new Date();
     return (now - joined) / (1000 * 60 * 60 * 24) < 7;
  });

  // Construct adminData for Navbar
  const adminData = {
      requests: allPendingRequests,
      newUsers: newUsers,
      sessions: sessions,
      onReview: (user) => { setSelectedItem(user); setModals({...modals, access: true}); }
  };

  // Helper Functions
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const requestConfirmation = (title, message, onConfirm) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmation(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- Effects ---
  useEffect(() => {
    const init = async () => {
      const token = sessionStorage.getItem('token') || 'demo-token'; 
      try {
        const user = await adminDashboardApiService.fetchUser(token);
        setCurrentUser(user || { Name: 'Super Admin', role: 'superadmin', email: 'admin@demo.com' });
        await loadData(token);
      } catch (e) {
        console.error("Auth failed:", e);
        setCurrentUser({ Name: 'Super Admin', role: 'superadmin', email: 'admin@demo.com' });
      } finally {
        setLoading(false);
      }
    };
    init();

    // Polling for updates (background fetch)
    const interval = setInterval(() => {
        const token = sessionStorage.getItem('token');
        if(token) loadData(token, true); // silent = true
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  // --- Data Loaders ---
  const loadData = async (t, silent = false) => {
    const token = t || sessionStorage.getItem('token') || 'demo-token';
    try {
      const [uData, sData, nData] = await Promise.all([
        adminDashboardApiService.fetchAllUsers(token),
        adminDashboardApiService.fetchSessions(token),
        adminDashboardApiService.fetchNotifications(token).catch(() => [])
      ]);
      setUsers(uData || []);
      setSessions((sData || []).sort((a,b) => a.dayNumber - b.dayNumber));
      setNotifications(nData || []);
    } catch(e) { console.error("Data load failed", e); }
  };

  // --- Handlers ---
  // Create Admin Handler
  const handleCreateAdmin = async (data) => {
    try {
        await adminDashboardApiService.createAdmin(data, sessionStorage.getItem('token'));
        showToast('Admin created successfully', 'success');
        setModals({...modals, admin: false});
        loadData();
    } catch (e) {
        showToast('Failed to create admin', 'error');
    }
  };
// Save Session Handler
  const handleSaveSession = async (data) => {
    const token = sessionStorage.getItem('token');
    const payload = { ...data, contextPoints: typeof data.contextPoints === 'string' ? data.contextPoints.split('\n').filter(x => x.trim()) : data.contextPoints };
    
    try {
        if (selectedItem) {
            await adminDashboardApiService.updateSession(selectedItem._id, payload, token);
            showToast('Session updated successfully', 'success');
        } else {
            await adminDashboardApiService.createSession(payload, token);
            showToast('Session created successfully', 'success');
        }
        setModals({...modals, session: false});
        setSelectedItem(null);
        loadData();
    } catch (e) {
      console.error(e.message);
        showToast(e.message, 'error');
    }
  };

  // Delete Session Handler
  const handleDeleteSession = (id) => {
    requestConfirmation(
      'Delete Session', 
      'Are you sure you want to delete this session? This action cannot be undone.',
      async () => {
        try {
            await adminDashboardApiService.deleteSession(id, sessionStorage.getItem('token'));
            showToast('Session deleted', 'success');
            loadData();
        } catch (e) {
            showToast('Failed to delete session', 'error');
        }
      }
    );
  };

  // Delete User Handler
  const handleDeleteUser = (id) => {
    requestConfirmation(
      'Delete User', 
      'Are you sure you want to delete this user? All their progress will be lost.',
      async () => {
        try {
            await adminDashboardApiService.deleteUser(id, sessionStorage.getItem('token'));
            showToast('User deleted', 'success');
            loadData();
        } catch (e) {
            showToast('Failed to delete user', 'error');
        }
      }
    );
  };

  // Grant/Revoke Access Handler
  const handleGrantAccess = async (sessionId, isGranted) => {
    try {
        const token = sessionStorage.getItem('token');
        const res = await adminDashboardApiService.grantAccess(selectedItem._id, sessionId, isGranted, token);
        
        // Optimistic Update
        setSelectedItem(prev => ({ 
            ...prev, 
            completedSessions: res.completedSessions, 
            specialAccess: res.specialAccess,
            accessRequests: res.accessRequests 
        }));
        
        // Refresh grid
        setUsers(prev => prev.map(u => u._id === selectedItem._id ? { ...u, ...res } : u));
        
        showToast(isGranted ? 'Access granted' : 'Access revoked', 'success');
        
        // Sync with DB
        await loadData(token);
    } catch (err) {
        showToast("Failed to update access", 'error');
    }
  };

    // Profile Update Handler
 const handleUpdateProfile = async (data) => {
    try {
        await adminDashboardApiService.updateProfile(data, sessionStorage.getItem('token'));
        showToast('Profile updated successfully!');
        setCurrentUser(prev => ({ ...prev, ...data }));
    } catch (e) {
        showToast('Failed to update profile.');
    }
  };
  // Password Reset Handler
  const handlePasswordReset = async (data) => {
  
    if (data.new !== data.confirm) {
        showToast('Passwords do not match');
      
    }
    try {
      const token = sessionStorage.getItem('token');
      // console.log('Resetting password with data:', data, 'and token:', token);
     await adminDashboardApiService.resetPassword(data, token);
        showToast('Password changed successfully!');
    } catch (e) {
        showToast(e.message || 'Failed to change password.');
    }
  };
   
  if (loading) return <div className="loader-screen"><Loader2 className="animate-spin" size={40}/></div>;

  return (
    <>
      <style>[styles]</style>
      <div className="sa-container">
        <AdminNavbar 
            user={currentUser} 
            adminData={adminData}
            notifications={notifications} 
            onProfileClick={() => setActiveTabProfile('profile')}
            onDashboardClick={() => setActiveTabProfile('dashboard')}
            onLogout={() => { sessionStorage.clear(); window.location.href='/login';}} 
        />
         
        {activeTabProfile === 'dashboard'? (
          <>
          <div className="sa-content">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>User Management</button>
            <button className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>Curriculum</button>
              <button className={`tab-btn ${activeTab === 'reflections' ? 'active' : ''}`} onClick={() => setActiveTab('reflections')}> Reflections</button>
            <button className={`tab-btn ${activeTab === 'access' ? 'active' : ''}`} onClick={() => setActiveTab('access')}>Access Policy</button>
          </div>

          {activeTab === 'users' ? (
            <UserManagementTab 
              users={users} 
              sessions={sessions}
              onManage={(u) => { setSelectedItem(u); setModals({...modals, access: true}); }}
              onDelete={handleDeleteUser}
              onCreateAdmin={() => setModals({...modals, admin: true})}
            />
          ) : activeTab === 'sessions' ? (
            <SessionManagementTab 
              sessions={sessions}
              onEdit={(s) => { setSelectedItem(s); setModals({...modals, session: true}); }}
              onDelete={handleDeleteSession}
              onCreateSession={() => { setSelectedItem(null); setModals({...modals, session: true}); }}
            />
          )  : activeTab === 'reflections' ? (
            <ReflectionTab />
          ): (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'300px', border:'2px dashed #333', borderRadius:'12px', color:'#666', gap:'16px'}}>
                <Shield size={48} color="#333" />
                <div style={{textAlign:'center'}}>
                   <h3 style={{margin:0, color:'#fff', fontSize:'1.2rem'}}>Access Policies</h3>
                   <p>Configure RBAC and security permissions.</p>
                </div>
                <button className="btn btn-outline">View Settings</button>
            </div>
          )}
        </div>
        </>
        ): (
          <div style={{ position: 'relative', padding: '16px', overflowY: 'auto', top:'95px'}}>
              <Profile 
                  user={currentUser} 
                  onUpdate={handleUpdateProfile} 
                  onPasswordChange={handlePasswordReset} 
              />
                 </div>
            )}
        
     
        {/* Modals */}
        <CreateAdminModal isOpen={modals.admin} onClose={() => setModals({...modals, admin: false})} onSave={handleCreateAdmin} />
        <SessionModal isOpen={modals.session} onClose={() => { setModals({...modals, session: false}); setSelectedItem(null); }} session={selectedItem} onSave={handleSaveSession} />
        <AccessManagementModal isOpen={modals.access} onClose={() => { setModals({...modals, access: false}); setSelectedItem(null); }} user={selectedItem} sessions={sessions} onGrant={handleGrantAccess} />
        
        <ConfirmationModal 
            isOpen={confirmation.isOpen} 
            title={confirmation.title} 
            message={confirmation.message} 
            onConfirm={confirmation.onConfirm} 
            onCancel={() => setConfirmation(prev => ({ ...prev, isOpen: false }))} 
        />
        
        <AdminToast 
            visible={toast.visible} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
        />
      </div>
    </>
  );
}

export default SuperAdminDashboard;