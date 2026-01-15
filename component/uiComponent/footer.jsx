import React from 'react'
import { Link } from 'react-router-dom'; 

import {  Twitter, Instagram, Linkedin } from 'lucide-react';
import footerStyles from '../../css/footer.css'
function footer(){
  return (
    <>
       <style>[footerStyles]</style>
    {/* NEW: SITE FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3 style={{color:'#fff;'}}> MeLifeCoaching</h3>
            <p className="footer-mission">Our mission is to empower individuals to break free from limitations and design a life of purpose, joy, and authentic connection.</p>
          </div>
          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-link-list">
               <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
             <Link to="/program">Program</Link>
            <Link to="/about">About</Link>
            
              {/* <a href="#">Home</a>
              <a href="#">Program</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a> */}
            </div>
          </div>
          <div className="footer-connect">
            <h4 className="footer-heading">Connect</h4>
            <div className="social-links-footer">
              <Twitter className="social-icon" size={24} />
              <Instagram className="social-icon" size={24} />
              <Linkedin className="social-icon" size={24} />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 MeLifeCoaching. All rights reserved.</span>
          <span>Designed for Impact (Virtuosos LLC)</span>
        </div>
      </footer>
   </>

  )
}
export default footer