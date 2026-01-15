import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { Menu, X } from 'lucide-react';
import LogoImg from '../../assests/Logo.jpg';

// 2. Import CSS directly (no variable needed)
import '../../css/navBar.css'; 

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="home-root">
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navContent">
          
          {/* LEFT: Logo - Links to Home "/" */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={LogoImg} alt="logo" className='logoImg'/>
            <span style={{ color: '#64748b' }}> MeLifeCoaching</span>
          </Link>

          {/* RIGHT: Desktop Nav Links */}
          <div className="nav-links desktop-only">
            <Link to="/program">Program</Link>
            <Link to="/about">About</Link>
            
            {/* Note: Stories is a section on Home, so we link to Home */}
            <Link to="/contact">Contact</Link> 
            
            {/* Login/Register should link to their specific pages */}
            <Link to="/login">
                <button className="btn btn-primary">Login</button>
            </Link>
            <Link to="/register">
                <button className="btn btn-primary">Register</button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          
          <Link to="/program" onClick={closeMenu}>Program</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          
          <Link to="/login" onClick={closeMenu}>Login</Link>
          <Link to="/register" onClick={closeMenu}>Register</Link>
          
          {/* Close Button */}
          <button 
            onClick={closeMenu}
            style={{ 
              marginTop: '20px', 
              background: 'transparent', 
              border: 'none', 
              color: '#64748b', 
              fontSize: '1rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <X size={20} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;