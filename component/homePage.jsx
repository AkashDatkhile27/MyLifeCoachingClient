import React ,{useEffect}from 'react'
import NavBar from './uiComponent/navBar'
import HeroSection1 from './uiComponent/HeroSection1'
import Stories from './uiComponent/stories'
import Footer from './uiComponent/footer'

import { useNavigate } from 'react-router-dom';

import { Brain, Heart, Compass, Shield, Target, Flame, Users } from 'lucide-react';

import '../css/homePage.css'
function HomePage() {
  const navigate = useNavigate(); // Initialize hook

  const handleProgramClick = () => {
    navigate('/program'); // Navigate to the program page
  };
   useEffect(() => {
    // If Lenis is active, use it to scroll to top immediately
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback if Lenis isn't loaded yet
      window.scrollTo(0, 0);
    }
  }, []);
  return (
<>    
   
{/* NAVBAR COMPONENT */}
<NavBar />
{/* HERO SECTION */}
<HeroSection1 />
 {/* The Philosophy Section */}
      <section className="section-philosophy">
        <div className="philosophy-content">
          <div className="philosophy-header">
            <span className="philosophy-label">The Philosophy</span>
            <h2 className="philosophy-title">Why this Program?</h2>
            <p className="philosophy-text">
              In a world that constantly demands more, we often lose sight of who we truly are. 
              We build layers of protection, masks of conformity, and habits of survival. 
              But deep down, there is a spark that refuses to be extinguished.
            </p>
            <div className="philosophy-quote-box">
              <p className="philosophy-quote">
                "The LIFE program isn't about adding more to your plate. It's about stripping away the non-essential to reveal the masterpiece underneath."
              </p>
            </div>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-card">
              <Compass size={40} className="philosophy-icon" strokeWidth={1.5} />
              <h3>Clarity</h3>
              <p>Find direction in the chaos and understand your true north.</p>
            </div>
            <div className="philosophy-card">
              <Flame size={40} className="philosophy-icon" strokeWidth={1.5} />
              <h3>Purpose</h3>
              <p>Ignite the passion that drives meaningful action every day.</p>
            </div>
            <div className="philosophy-card">
              <Users size={40} className="philosophy-icon" strokeWidth={1.5} />
              <h3>Community</h3>
              <p>Connect with like-minded souls on the same journey of growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pillars of Change Section */}
      <section className="section-why">
        <h2 className="section-title">The Pillars of Clarity </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Brain size={32} /></div>
            <h3 className="feature-title">Mental Clarity</h3>
            <p className="feature-desc">Master overthinking. Gain the tools to manage the Noise </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Heart size={32} /></div>
            <h3 className="feature-title">Emotional Balance</h3>
            <p className="feature-desc">Break free from fear. Learn to respond, not react.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Compass size={32} /></div>
            <h3 className="feature-title">True Purpose</h3>
            <p className="feature-desc">Navigate your life with unshakeable confidence.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Shield size={32} /></div>
            <h3 className="feature-title">Resilience</h3>
            <p className="feature-desc">Bounce back from setbacks stronger than before.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Flame size={32} /></div>
            <h3 className="feature-title">Vital Energy</h3>
            <p className="feature-desc">Reclaim the energy to pursue what matters.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Target size={32} /></div>
            <h3 className="feature-title">Aligned Action</h3>
            <p className="feature-desc">Stop drifting. Move with precision and intent.</p>
          </div>
        </div>
      </section>
      {/*Stories / members feedback */}
      <Stories/>

    <section className="section-cta">
        <h2 className="cta-title">Ready to play the real game?</h2>
        <p className="cta-subtitle">Stop letting life happen to you. Take control of your inner world and create the life you actually want.</p>
        <button className="btn-cta" onClick={handleProgramClick}>See the Program</button>
      </section>

    {/**Footer Section */}
    <Footer/>
</>
)
}

export default HomePage