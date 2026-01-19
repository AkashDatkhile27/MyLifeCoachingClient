import React, { useState, useEffect,useRef } from 'react';

import { Hexagon, ChevronDown, Bell, User, LogOut } from 'lucide-react';
import '../../../css/adminDashboard.css'
import LogoImg from '../../../assests/Logo.jpg';
import { Home } from 'lucide-react';

import AdminNotificationDropdown from './AdminNotificationDropdown';
import * as utils from '../../../utils/getUserSessionStatusAndInitials';

const AdminNavbar = ({ user, notifications = [], adminData, onLogout, onProfileClick, onDashboardClick }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeUser = user || { Name: 'Admin', email: '', profilePicture: null };
  
  // Calculate unread count (requests + new users)
  const unreadCount = (adminData?.requests?.length || 0) + (adminData?.newUsers?.length || 0);
  return (
    <nav className="admin-navbar">
      <div className="nav-content">
        <div className="logo">
            <img src={LogoImg} alt="logo" className='logoImg'/>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>MeLifeCoaching</span>
        </div>

        <div className="nav-links desktop-only">
          <div style={{ fontSize: '0.9rem', color: '#a3a3a3' }}>
            Hi, <span style={{ color: '#fff', fontWeight: 600 }}>{safeUser.Name}</span>
          </div>
          {/* Notification Icon */}
          <div className="notification-container" ref={notifRef}>
            <button className="notification-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge"></span>}
            </button>
            <AdminNotificationDropdown 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                requests={adminData?.requests}
                newUsers={adminData?.newUsers}
                systemNotifications={notifications} // Passed separately
                onReview={adminData?.onReview}
                sessions={adminData?.sessions}
            />
          </div>
          <div className="profile-dropdown-container">
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="profile-btn">
              {safeUser.profilePicture ? (
                <img className="avatar-img" src={safeUser.profilePicture} alt={safeUser.Name} />
              ) : (
                <div className="avatar-initials">{utils.getInitials(safeUser.Name)}</div>
              )}
              <ChevronDown size={14} color="#a3a3a3" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {isProfileDropdownOpen && (
              <div className="dropdown-menu">
                <div style={{ padding: '0 12px 8px', borderBottom: '1px solid #333', marginBottom: '8px' }}>
                   <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signed in as</div>
                   <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{safeUser.email}</div>
                </div>
                 <button onClick={() => { setIsProfileDropdownOpen(false); onProfileClick(); }} className="dropdown-item"><User size={16} /> Profile</button>
                <button onClick={() => { setIsProfileDropdownOpen(false); onDashboardClick(); }} className='dropdown-item'><Home size={16} />Dashboard</button>
                <button onClick={onLogout} className="dropdown-item danger"><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-menu-btn" >
              {/* Notification Icon */}
          <div className="notification-container" ref={notifRef}>
            <button className="notification-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge"></span>}
            </button>
            <AdminNotificationDropdown 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                requests={adminData?.requests}
                newUsers={adminData?.newUsers}
                systemNotifications={notifications} // Passed separately
                onReview={adminData?.onReview}
                sessions={adminData?.sessions}
            />
          </div>
          <div className="profile-dropdown-container">
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="profile-btn">
              {safeUser.profilePicture ? (
                <img className="avatar-img" src={safeUser.profilePicture} alt={safeUser.Name} />
              ) : (
                <div className="avatar-initials">{utils.getInitials(safeUser.Name)}</div>
              )}
              <ChevronDown size={14} color="#a3a3a3" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {isProfileDropdownOpen && (
              <div className="dropdown-menu">
                <div style={{ padding: '0 12px 8px', borderBottom: '1px solid #333', marginBottom: '8px' }}>
                   <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signed in as</div>
                   <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{safeUser.email}</div>
                </div>
         
                 <button onClick={() => { setIsProfileDropdownOpen(false); onProfileClick(); }} className="dropdown-item"><User size={16} /> Profile</button>
                <button onClick={() => { setIsProfileDropdownOpen(false); onDashboardClick(); }} className='dropdown-item'><Home size={16} />Dashboard</button>
                <button onClick={onLogout} className="dropdown-item danger"><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )}

export default AdminNavbar