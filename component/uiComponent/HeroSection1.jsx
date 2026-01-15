import React, { useState, useEffect } from 'react';
import { Brain, Heart } from 'lucide-react';
import HomePage from '../homePage'
import style from '../../css/HeroSection1.css'
import ImgBackground from '../../assests/LandingPageBackground.jpg'

import BookingModal from './BookingModal';

/**
 * RippleButton Component
 */
const RippleButton = ({ children, onClick, className = '' }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    const newRipple = { x, y, diameter, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  return (
    <div className="button-wrapper">
      <div className="continuous-pulse"></div>
      <div className="continuous-pulse delay"></div>
      <button className={`life-button ${className}`} onClick={createRipple}>
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{ top: ripple.y, left: ripple.x, width: ripple.diameter, height: ripple.diameter }}
            className="click-ripple"
          />
        ))}
        <span style={{ position: 'relative', zIndex: 10 }}>{children}</span>
      </button>
    </div>
  );
};

/**
 * Hero Section 1
 */
const HeroSection1 = () => {
  const handleLifeClick = () => {
    console.log("Life button clicked. Navigating to /home.");
    window.scrollTo(0, 0);
  };

   const [isBookingOpen, setIsBookingOpen] = useState(false);
  return (
    <>
     <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    <div className="landing-container">
      <style>[styles]</style>
      <div className="bg-wrapper">
        <img src={ImgBackground} alt="Portrait Background" className="bg-image" />
        <div className="bg-overlay"></div>
      </div>
      
      <div className="content-wrapper">
        <div className="fade-in-up">
          <RippleButton onClick={handleLifeClick}>LIFE</RippleButton>
        </div>
        
        <h1 className="headline fade-in-up delay-100">
          Chaos to Clarity.<br/>
          <span className="subtitle-highlight">15 days to transform your inner world.</span>
        </h1>
        
        <p className="description_h1 fade-in-up delay-300">
          Stop living in the fog of confusion. Start your journey to mental clarity and emotional freedom today.
          <br /><br />
          <span className="offer-highlight">
            Book your first session by paying just <span className="price">₹199/-</span> <span className="strike">₹5000/-</span>
          </span>
        </p>
        
        {/* Book Button */}
        <div className="fade-in-up delay-300">
            <button className="book-now-btn"  onClick={() => setIsBookingOpen(true)}>Book Now</button>
        </div>

        <div className="footer-icons fade-in-up delay-500">
          <div className="icon-group">
            <Brain size={24} color="#d1d5db" />
            <span className="icon-label">Mind</span>
          </div>
          <div className="divider"></div>
          <div className="icon-group">
            <Heart size={24} color="#d1d5db" />
            <span className="icon-label">Soul</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HeroSection1