import React, { useState, useEffect,useRef } from 'react';

import { Bell, ChevronDown, User, Home, LogOut, MessageSquare,Zap } from 'lucide-react';
import '../../css/dashboard.css'
import NotificationDropdown from '../uiComponent/NotificationDropdown';
import LogoImg from '../../assests/Logo.jpg';

import * as utils from '../../utils/getUserSessionStatusAndInitials';
import Flashcards from './userFlashcards';

const UserNavbar =({ user, notifications = [], onProfileClick, onLogout, onDashboardClick,onReflectionsClick,onFlashcardsClick}) => {
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

  const safeUser = user || { Name: 'Guest', email: '', profilePicture: null };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="user-navbar">
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
            <NotificationDropdown 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
            />
          </div>
           {/* daily Journal */}
          <div className="notification-container" ref={notifRef}>
           <button className="notification-btn" onClick={() => onReflectionsClick()}> <MessageSquare size={16}/>
            </button>
            </div>
            <div className='notification-container'>
          <button className="notification-btn" onClick={() => {onDashboardClick(); }}><Home size={16} /></button></div>
           {/* New Flashcards Option */}
          <div className="nav-item" onClick={onFlashcardsClick} style={{cursor:'pointer', display:'flex', alignItems:'center', gap:6}}>
             <Zap size={16}/> Flashcards
          </div>
          <div className="profile-dropdown-container">
            <button  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="profile-btn">
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
                 <button onClick={() => { setIsProfileDropdownOpen(false); onReflectionsClick(); }} className="dropdown-item"><MessageSquare size={16}/> Daily Journal</button>
                <button onClick={() => { setIsProfileDropdownOpen(false); onDashboardClick(); }} className='dropdown-item'><Home size={16} />Dashboard</button>
                  <button onClick={() => { setIsProfileDropdownOpen(false); onFlashcardsClick(); }} className='dropdown-item'><Zap size={16} />Flashcard</button>
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
            <NotificationDropdown 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
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
         
                <button onClick={() => { setIsProfileDropdownOpen(false); onProfileClick(); }}  className="dropdown-item"><User size={16} /> Profile</button>
                 <button onClick={() => { setIsProfileDropdownOpen(false); onReflectionsClick(); }} className="dropdown-item"><MessageSquare size={16}/> Daily Journal</button>
                 <button onClick={() => { setIsProfileDropdownOpen(false); onDashboardClick(); }} className='dropdown-item'><Home size={16} />Dashboard</button>
                 <button onClick={() => { setIsProfileDropdownOpen(false); onFlashcardsClick(); }} className='dropdown-item'><Zap size={16} />Flashcard</button>
                <button onClick={onLogout} className="dropdown-item danger"><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )}

export default UserNavbar