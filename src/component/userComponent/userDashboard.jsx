import React, { useState, useEffect,useRef} from 'react';

import { Lightbulb, CheckCircle, Loader2 } from 'lucide-react';
// --- TOAST COMPONENT ---
import {Toast} from '../uiComponent/Toast';

// --- COMPONENTS ---
import AudioPlayerModal from './AudioPlayerModal';
import UserNavbar from './userNavbar'
import UserSession from './UserSession'
import Footer from '../uiComponent/footer'
import Profile from '../CommonComponent/Profile';
import UserReflections from './UserReflection'; 
// --- UTILITIES ---
import generateSystemNotifications from '../../utils/generateSystemNotifications';
// --- CONFIGURATION ---
import styles from '../../css/dashboard.css';


// --- API SERVICE ---
import userApiService from '../../apiServices/userDashboardApiService';

const UserDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioSession, setAudioSession] = useState(null);
  const [notifications, setNotifications] = useState([]);
  // user reflection state
      const [selectedReflectionSessionId, setSelectedReflectionSessionId] = useState(null);

    // Tabs State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'profile'
  // Toast State
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const latestNotificationRef = useRef(null);

  // Helper for displaying toasts easily
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  // --- Load Data ---
  const loadData = async () => {
    try {
      const token = sessionStorage.getItem('token') || 'demo-token';
      
      // Parallel Fetch
      const [userData, sessionsData] = await Promise.all([
        userApiService.fetchUser(token),
        userApiService.fetchSessions(token)
      ]);

      setCurrentUser(userData || { Name: 'Demo User', createdAt: new Date().toISOString() });

      // Merge User Progress
      const mergedSessions = (sessionsData || []).map(session => {
          const isCompleted = userData?.completedSessions?.includes(session._id);
          const specialAccess = userData?.specialAccess?.find(sa => sa.sessionId === session._id);
          const requests = userData?.accessRequests?.filter(r => r.sessionId === session._id) || [];
          const isPending = requests.some(r => r.status === 'pending');

          return {
              ...session,
              isCompleted: !!isCompleted,
              hasSpecialAccess: !!specialAccess,
              specialAccessExpiresAt: specialAccess ? specialAccess.expiresAt : null,
              accessRequestStatus: isPending ? 'pending' : null,
              specialAccessCount: requests.length
          };
      });

      setSessions(mergedSessions.sort((a, b) => a.dayNumber - b.dayNumber));

      // Notifications Logic
      const systemNotifs = generateSystemNotifications(mergedSessions, userData?.createdAt);
      const apiNotifs = await userApiService.fetchNotifications(token).catch(() => []);
      
      // Combine and Sort by Timestamp (Newest First)
      const combinedNotifs = [...systemNotifs, ...apiNotifs].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(combinedNotifs);

      // Update ref for polling
      if (combinedNotifs.length > 0) {
         latestNotificationRef.current = combinedNotifs[0].createdAt || combinedNotifs[0]._id;
      }

    } catch (err) {
      console.warn("Dashboard Load Failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Separate function to fetch ONLY notifications for polling
  const fetchNewNotifications = async () => {
    const token = sessionStorage.getItem('token') || 'demo-token';
    try {
        const apiNotifs = await userApiService.fetchNotifications(token).catch(() => []);
        
        // Basic check for new notifications
        const newest = apiNotifs.length > 0 ? apiNotifs[0] : null;
        const newestId = newest ? (newest.createdAt || newest._id) : null;

        if (newestId && newestId !== latestNotificationRef.current) {
            // New notification detected!
            showToast(newest.message);
            latestNotificationRef.current = newestId;
            
            // Merge with existing state WITHOUT refreshing sessions
            // We need to re-merge because we want to keep system notifications
            setNotifications(prev => {
                // Filter out old system notifs from prev state? 
                // Actually, just re-generating system notifs based on current state is safest
                // But since we aren't refreshing sessions, system notifs (unlocks) won't change
                const currentSystemNotifs = prev.filter(n => n.type === 'info' || n.type === 'warning'); 
                
                // Merge and Sort
                return [...currentSystemNotifs, ...apiNotifs].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            });
        }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    loadData(); 
    
    // Optimized Polling: Only fetch notifications
    const interval = setInterval(() => {
        fetchNewNotifications();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  const handleRequestAccess = async (sessionId) => {
    try {
        const token = sessionStorage.getItem('token');
        await userApiService.requestAccess(sessionId, token); 
        setSessions(prev => prev.map(s => 
            s._id === sessionId ? { ...s, accessRequestStatus: 'pending', specialAccessCount: (s.specialAccessCount || 0) + 1 } : s
        ));
        showToast("Request sent successfully! Admin will be notified.");
    } catch (err) {
        showToast("Failed to send request.");
    }
  };
  
  // Profile Update Handler
 const handleUpdateProfile = async (data) => {
    try {
        await userApiService.updateProfile(data, sessionStorage.getItem('token'));
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
     await userApiService.resetPassword(data, token);
        showToast('Password changed successfully!');
    } catch (e) {
        showToast(e.message || 'Failed to change password.');
    }
  };

  //  Mark Session as Complete
  const markSessionComplete = async (sessionId) => {
    setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, isCompleted: true } : s));
    try {
      const token = sessionStorage.getItem('token');
      await userApiService.completeSession(sessionId, token);
      showToast("Session completed successfully! 🎉");
    } catch (err) {
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, isCompleted: false } : s));
      showToast("Failed to sync completion status.");
    }
  };

    // Start Session Handler
  const handleStartSession = (sessionId) => {
    const session = sessions.find(s => s._id === sessionId);
    if (!session) return;
    if (session.type === 'Recorded') {
      setAudioSession(session);
    } else {
      markSessionComplete(sessionId);
    }
  };


// user reflection component
    const handleReflect = (session) => {
        setSelectedReflectionSessionId(session._id);
        setActiveTab('reflections');
    };

  if (loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000', color:'#fff'}}><Loader2 className="animate-spin" /></div>;

  const completedSessionsCount = sessions.filter(s => s.isCompleted).length;

  return (
    <>
      <style>[styles]</style>
      <div className="dashboard-scope">
        <UserNavbar 
            user={currentUser} 
            notifications={notifications} 
            onProfileClick={() => setActiveTab('profile')}
            onDashboardClick={() => setActiveTab('dashboard')}
             onReflectionsClick={() => setActiveTab('reflections')}
            onLogout={() => { sessionStorage.clear(); window.location.href='/login';}} 
        />
        
        <div className="scrollable-area">
          <div className="content-max-width">
               {activeTab === 'dashboard' ? (
              <>
            <div className="dashboard-top-grid">
                <div className="welcome-banner">
                  <h1 className="welcome-title">Welcome back, {currentUser?.Name?.split(' ')[0] || 'Traveler'}!</h1>
                  <p className="welcome-sub">You are on your transformation journey. Keep up the momentum!</p>
                  <div className="banner-stats">
                    <div className="stat-pill"><CheckCircle size={18} /> {completedSessionsCount} Sessions Completed</div>
                  </div>
                </div>
                <div className="flashcard">
                  <div className="flashcard-header"><Lightbulb size={16} /> Daily Insight</div>
                  <p className="flashcard-content">"Growth happens when you start doing the things you aren't qualified to do."</p>
                  <div className="flashcard-footer">— Steven Bartlett</div>
                </div>
            </div>

            <div className="sessions-list">
               <div className="timeline-line"></div>
               {sessions.map(session => (
                 <UserSession 
                   key={session._id} 
                   session={session} 
                   userCreatedAt={currentUser?.createdAt}
                   onRequestAccess={handleRequestAccess}
                   onOpenReflection={handleReflect}
                   onStartSession={handleStartSession}
                 />
               ))}
            </div>
             </>
            ): activeTab === 'reflections' ? (
                <UserReflections 
                    sessions={sessions} 
                    user={currentUser} 
                    initialSessionId={selectedReflectionSessionId}/>) :(
              <Profile 
                  user={currentUser} 
                  onUpdate={handleUpdateProfile} 
                  onPasswordChange={handlePasswordReset} 
              />
            )}
          </div>
        </div>

        <AudioPlayerModal isOpen={!!audioSession} onClose={() => setAudioSession(null)} session={audioSession} onComplete={(id) => { setAudioSession(null); markSessionComplete(id); }}/>
        
        {/* Toast Notification */}
        <Toast 
            show={toast.show} 
            message={toast.message} 
            onClose={() => setToast({ ...toast, show: false })} 
        />
        <Footer />
      </div>
    </>
  );
};
export default UserDashboard