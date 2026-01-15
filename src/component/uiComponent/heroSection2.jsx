import React, { useEffect, useRef } from 'react';
import styles from '../../css/heroSection2.css'
import BackgroundImg from '../../assests/HeroSectionBackground.jpg'; 
const HeroSection2 = () => {

  return (
   <>
    <div className="landing-container_h2">
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
          <h1 className="headline">My Journey</h1>
          <p className="description">From Self-Doubt to Transforming Lives</p>
        </div>
      </div>
   </>
  )
}

export default HeroSection2