import React, { useState,useEffect } from 'react';
import { Lightbulb, RefreshCw, Clock, Heart, CheckCircle, ChevronUp, ChevronDown, DollarSign, Calendar, Infinity, Shield } from 'lucide-react';
import NavBar from './uiComponent/navBar'
import { Link } from 'react-router-dom'; 

import HeroSection3 from './uiComponent/heroSection3'
import Footer from './uiComponent/footer'
import style from '../css/programPage.css'

const Program = () => {
   useEffect(() => {
    // If Lenis is active, use it to scroll to top immediately
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback if Lenis isn't loaded yet
      window.scrollTo(0, 0);
    }
  }, []);
     const [activeIndex, setActiveIndex] = useState(null);
    const faqs = [
    { q: "Is there an age limit for this program?", a: "This program is open to adults of all ages (18+). The concepts are universal and apply whether you are just starting your career or looking back on a full life." },
    { q: "How often should I engage with the content?", a: "The program is designed for daily engagement to build momentum. However, you have lifetime access, so you can pace yourself if life gets busy." },
    { q: "What if I miss a day or fall behind?", a: "No problem at all. There is no 'behind'. You can pick up right where you left off. The journey is yours to take at your own rhythm." },
    { q: "Do I need any prior knowledge of philosophy?", a: "None whatsoever. We strip away the academic jargon and focus on practical, actionable wisdom that applies to everyday life." },
    { q: "What makes this different from other self-help programs?", a: "We don't offer quick fixes or hype. We focus on foundational shifts in perspective using time-tested philosophical principles, not just temporary motivation." }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <>
    <NavBar/>
    <HeroSection3/>
    <style>[style]</style>
    <section className="section-pillars">
    <div className="section-header">
      <h2 className="section-headline">The Four Pillars</h2>
      <p className="section-subhead">Every transformative journey is built on solid foundations</p>
    </div>
    <div className="pillars-grid">
      <div className="pillar-card">
        <div className="pillar-icon-box" style={{background: '#f5f3ff', color: '#7c3aed'}}>
          <Lightbulb size={32} />
        </div>
        <h3 className="pillar-title">Why</h3>
        <p className="pillar-desc">Understanding your deeper motivations and the driving forces behind your actions. Discover your authentic self beneath the noise.</p>
      </div>
      <div className="pillar-card">
        <div className="pillar-icon-box" style={{background: '#ecfdf5', color: '#10b981'}}>
          <RefreshCw size={32} />
        </div>
        <h3 className="pillar-title">What</h3>
        <p className="pillar-desc">Practical tools and philosophical frameworks that you can apply immediately. Real strategies for real challenges.</p>
      </div>
      <div className="pillar-card">
        <div className="pillar-icon-box" style={{background: '#fffbeb', color: '#f59e0b'}}>
          <Clock size={32} />
        </div>
        <h3 className="pillar-title">When</h3>
        <p className="pillar-desc">Daily sessions designed to fit your schedule. Consistent progress through manageable, impactful daily practices.</p>
      </div>
      <div className="pillar-card">
        <div className="pillar-icon-box" style={{background: '#fef2f2', color: '#ef4444'}}>
          <Heart size={32} />
        </div>
        <h3 className="pillar-title">Where</h3>
        <p className="pillar-desc">In the comfort of your own space, with personalized guidance and a supportive community of fellow travelers.</p>
      </div>
    </div>
  </section>

   <section className="section-audience">
    <div className="section-header">
      <h2 className="section-headline">Who Is This For?</h2>
      <p className="section-subhead">This program is designed for those ready to do the inner work</p>
    </div>
    <div className="audience-grid">
      <div className="audience-item">
        <CheckCircle className="check-icon" size={24} />
        <div className="audience-content">
          <h4>Seekers of Meaning</h4>
          <p>You feel there's more to life but can't quite grasp what that "more" is.</p>
        </div>
      </div>
      <div className="audience-item">
        <CheckCircle className="check-icon" size={24} />
        <div className="audience-content">
          <h4>Relationship Strugglers</h4>
          <p>Difficulty connecting authentically with others or yourself.</p>
        </div>
      </div>
      <div className="audience-item">
        <CheckCircle className="check-icon" size={24} />
        <div className="audience-content">
          <h4>Those Feeling Stuck</h4>
          <p>You're successful on paper but feel empty or unfulfilled inside.</p>
        </div>
      </div>
      <div className="audience-item">
        <CheckCircle className="check-icon" size={24} />
        <div className="audience-content">
          <h4>Philosophy Curious</h4>
          <p>Drawn to deeper questions but need practical application.</p>
        </div>
      </div>
      <div className="audience-item">
        <CheckCircle className="check-icon" size={24} />
        <div className="audience-content">
          <h4>Life Transition Navigators</h4>
          <p>Going through major life changes and need clarity on your next steps.</p>
        </div>
      </div>
      <div className="audience-item">
        <CheckCircle className="check-icon" size={24} />
        <div className="audience-content">
          <h4>Ready for Change</h4>
          <p>Committed to doing the inner work required for transformation.</p>
        </div>
      </div>
    </div>
  </section>

  <section className="section-details">
    <div className="section-header">
      <h2 className="section-headline">Program Details</h2>
      <p className="section-subhead">Everything you need to know about your transformation journey</p>
    </div>
    <div className="details-card">
      <div className="details-header-row">
        <div className="detail-stat">
          <div className="detail-icon-circle" style={{background: '#7c3aed'}}>
            <DollarSign size={24} />
          </div>
          <div className="stat-label">How Much?</div>
          <div className="stat-value">$10</div>
          <div className="stat-sub">One-time Investment</div>
        </div>
        <div className="detail-stat">
          <div className="detail-icon-circle" style={{background: '#10b981'}}>
            <Calendar size={24} />
          </div>
          <div className="stat-label">How Many Sessions?</div>
          <div className="stat-value">15</div>
          <div className="stat-sub">Daily sessions</div>
        </div>
        <div className="detail-stat">
          <div className="detail-icon-circle" style={{background: '#f59e0b'}}>
            <Infinity size={24} />
          </div>
          <div className="stat-label">How Long?</div>
          <div className="stat-value">Lifetime</div>
          <div className="stat-sub">Access forever</div>
        </div>
      </div>
      <div className="details-content">
        <h4 style={{textAlign: 'center', fontSize: '1.2rem', fontWeight: '700', marginBottom: '30px'}}>What's Included</h4>
        <div className="details-list-grid">
           <div className="detail-list-item"><CheckCircle className="mini-check"/> 15 guided sessions</div>
           <div className="detail-list-item"><CheckCircle className="mini-check"/> Personal 1-on-1 call</div>
           <div className="detail-list-item"><CheckCircle className="mini-check"/> Daily reflection journal</div>
           <div className="detail-list-item"><CheckCircle className="mini-check"/> Philosophy flashcards</div>
           <div className="detail-list-item"><CheckCircle className="mini-check"/> Lifetime community access</div>
           <div className="detail-list-item"><CheckCircle className="mini-check"/> Downloadable resources</div>
        </div>
      </div>
    </div>
  </section>

<section className="section-faq">
      <div className="section-header">
        <h2 className="section-headline">Frequently Asked Questions</h2>
      </div>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.q}
              {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <div className="faq-answer">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>

      <section className="section-cta-footer">
    <div className="about-container">
      <h2 className="cta-headline">Ready to play the real game?</h2>
      <p className="cta-sub">
        Your growth starts the moment you say yes. Join thousands who have already begun their transformation.
      </p>
       <Link to="/register"  className="link-black">
      <button className="final-btn">    
           Join the Program – $10
      </button>
       </Link>
      <div style={{marginTop: '20px', fontSize: '0.9rem', fontStyle: 'italic', opacity: '0.8'}}>
        Your growth starts the moment you say yes.
      </div>

      <div className="footer-bottom">
        <div className="footer-link"><Shield size={14}/> Secure Payment</div>
        <div className="footer-link"><Infinity size={14}/> Lifetime Access</div>
        <div className="footer-link"><Heart size={14}/> Personal Support</div>
      </div>
    </div>
  </section>
<Footer/>
    </>
  )
}

export default Program