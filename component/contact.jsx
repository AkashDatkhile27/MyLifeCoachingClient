import React, { useState, useEffect } from 'react';
import { 
   Twitter, Instagram, Heart, Linkedin, Clock,
 Shield,  Mail, MessageCircle, Send, Zap
} from 'lucide-react';
import Footer from './uiComponent/footer'
import NavBar from './uiComponent/navBar'

import '../css/contact.css'


const Contact = () => {
  return (
    <>
    <NavBar/>
  <div className="contact-page">
      <div className="contact-hero">
        <h1 className="contact-headline">Get in Touch</h1>
        <p className="contact-sub">Ready to start your journey? Have questions about the program? I'm here to help.</p>
      </div>

      <div className="contact-container">
        {/* Left: Form */}
        <div className="contact-card">
          <h2 style={{fontSize:'1.5rem', fontWeight:'700', marginBottom:'1.5rem', color:'#111'}}>Send me a message</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group-contact">
              <label className="form-label-contact">Full Name</label>
              <input type="text" className="form-input-contact" placeholder="Enter your full name" />
            </div>
            <div className="form-group-contact">
              <label className="form-label-contact">Email Address</label>
              <input type="email" className="form-input-contact" placeholder="Enter your email" />
            </div>
            <div className="form-group-contact">
              <label className="form-label-contact">Subject</label>
              <select className="form-select-contact">
                <option>General Inquiry</option>
                <option>Course Support</option>
                <option>Personal Coaching</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group-contact">
              <label className="form-label-contact">Message</label>
              <textarea className="form-textarea-contact" placeholder="Share your thoughts, questions, or how I can help you..."></textarea>
            </div>
            <button className="btn-submit-contact">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>

        {/* Right: Info & Connect */}
        <div className="contact-sidebar">
          <div style={{paddingLeft:'20px'}}>
            <h3 style={{fontSize:'1.25rem', fontWeight:'700', marginBottom:'20px', color:'#111'}}>Let's Connect</h3>
            
            <div className="info-item">
              <div className="info-icon-box bg-purple-light"><Mail size={24} /></div>
              <div className="info-content">
                <h4>Email</h4>
                <p>hello@melifecoaching.com<br/><span style={{fontSize:'0.8rem', color:'#888'}}>I typically respond within 24 hours</span></p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box bg-green-light"><Clock size={24} /></div>
              <div className="info-content">
                <h4>Response Time</h4>
                <p>Within 24 hours<br/><span style={{fontSize:'0.8rem', color:'#888'}}>Monday to Friday, 9 AM - 6 PM IST</span></p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box bg-orange-light"><Heart size={24} /></div>
              <div className="info-content">
                <h4>Personal Touch</h4>
                <p>Every message gets my personal attention<br/><span style={{fontSize:'0.8rem', color:'#888'}}>No automated responses, just genuine care</span></p>
              </div>
            </div>
          </div>

          <div className="quote-card">
            <p className="quote-text">"The most important conversations are the ones we have with ourselves. But sometimes, we need a guide to help us find the right questions."</p>
            <p className="quote-author">— Your Guide</p>
            <div style={{marginTop:'20px', fontSize:'0.9rem', color:'#666', marginBottom:'10px'}}>Follow the journey</div>
            <div className="social-links">
              <button className="social-btn"><Instagram size={18} /></button>
              <button className="social-btn"><Twitter size={18} /></button>
              <button className="social-btn"><Linkedin size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="features-grid">
        <div className="feature-card-small">
          <div className="feature-icon-small bg-green-light"><Shield size={20} /></div>
          <h4 style={{fontWeight:'700', marginBottom:'8px'}}>Privacy First</h4>
          <p style={{fontSize:'0.9rem', color:'#666'}}>Your information is safe and will never be shared with third parties.</p>
        </div>
        <div className="feature-card-small">
          <div className="feature-icon-small bg-purple-light"><MessageCircle size={20} /></div>
          <h4 style={{fontWeight:'700', marginBottom:'8px'}}>Personal Support</h4>
          <p style={{fontSize:'0.9rem', color:'#666'}}>Get direct access to guidance and support throughout your journey.</p>
        </div>
        <div className="feature-card-small">
          <div className="feature-icon-small bg-orange-light"><Zap size={20} /></div>
          <h4 style={{fontWeight:'700', marginBottom:'8px'}}>Quick Start</h4>
          <p style={{fontSize:'0.9rem', color:'#666'}}>Ready to begin? I'll help you get started on your transformation today.</p>
        </div>
      </div>

      <Footer />
    </div>
    </>
  )
}

export default Contact