import React, { useState, useEffect } from 'react';
import { Brain, Heart } from 'lucide-react';
import HomePage from '../homePage'
import styles from '../../css/HeroSection1.css'
import ImgBackground from '../../assests/LandingPageBackground.jpg'

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
 * Landing Page Component
 * Accepts a 'navigate' prop to simulate routing
 */
// function LandingPage  ({ navigate }) {
  function HeroSection1  () {
  // NOTE FOR USER:
  // In your local project, uncomment these lines and remove the 'navigate' prop above:
  // import { useNavigate } from 'react-router-dom';
  // const navigate = useNavigate();

  // Auto-redirect logic
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     console.log("10 seconds passed. Auto-navigating to /home.");
      
  //     // FOR LOCAL PROJECT: Use navigate('/home');
  //     navigate('/home'); 
      
  //     window.scrollTo(0, 0);
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  const handleLifeClick = () => {
    console.log("Life button clicked. Navigating to /home immediately.");
    
    // FOR LOCAL PROJECT: Use navigate('/home');
    // navigate('/home');

    window.scrollTo(0, 0);
  };

  return (
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
        <p className="description fade-in-up delay-300">
          Stop living in the fog of confusion. Start your journey to mental clarity and emotional freedom today.
        </p>
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
  );
};


export default HeroSection1