import React, { useEffect, useRef } from 'react';
import styles from '../../css/heroSection2.css'
import BackgroundImg from '../../assests/HeroSectionBackground3.jpg'; 
const HeroSection3 = () => {

  return (
   <>
    <div className="landing-container">
        {/* Background Wrapper */}
        <div className="bg-wrapper">
          <img 
            src={BackgroundImg} 
            alt="Journey Silhouette" 
            className="bg-image"
          />
          <div className="bg-overlay"></div>
        </div>
        
        {/* Content Wrapper */}
        <div className="content-wrapper fade-in-up">
          <h1 className="headline">15 Days to Clarity and Power</h1>
          <p className="description">Transform your relationship with yourself and discover the tools to navigate life with purpose</p>
        </div>
      </div>
   </>
  )
}

export default HeroSection3