import React,{useEffect} from 'react';
import styles from '../css/aboutPage.css'
import NavBar from './uiComponent/navBar'
import Footer from './uiComponent/footer'
import { Link } from 'react-router-dom'; 
import { Heart, ArrowRight } from 'lucide-react';
import HeroSection2 from './uiComponent/heroSection2'


/*Images*/
import ImgOne from '../assests/ImgOne.jpg'; 
import ImgTwo from '../assests/ImgTwo.jpg'; 
import ImgThree from '../assests/ImgThree.jpg';
import ImgFourth from '../assests/ImgFourth.jpg'; 
import ImgFifth from '../assests/ImgFifth.jpg'; 
import ImgSix from '../assests/ImgSix.jpg'; 


const AboutSection = () => {
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
      <style>[styles]</style>
      <NavBar />
      <HeroSection2 />
      
     <section className="section-about">
        <div className="about-container">
          
          {/* --- CHAPTER ONE: Journey --- */}
          <div className="chapter-card">
            <div>
              <span className="chapter-tag tag-purple">Chapter One</span>
              <h2 className="chapter-title">My Journey — From Self-Doubt to Transforming Lives</h2>
              <p className="chapter-text">
                There was a time in my life when I was stuck in a deep fog of confusion, self-doubt, and inner chaos. Questions constantly circled my mind:
              </p>
              <ul className="questions-list">
                 <li>What’s wrong with me?</li>
                 <li>Am I weird? Am I less than others?</li>
                 <li>Why do I get so angry?</li>
                 <li>Why did I fail in 5th grade?</li>
                 <li>Why was I bullied in school?</li>
              </ul>
              <p className="chapter-text">
                So many such thoughts and emotions led me to feel small, broken, and disconnected like I just didn’t fit in.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img src={ImgOne} alt="Lonely classroom" className="about-image" />
            </div>
          </div>

          {/* --- CHAPTER TWO: Curiosity --- */}
          <div className="chapter-card">
             <div className="about-image-wrapper">
              <img src={ImgTwo} alt="Stack of books" className="about-image" />
            </div>
            <div>
              <span className="chapter-tag tag-orange">Chapter Two</span>
              <h2 className="chapter-title">The Curiosity That Changed Everything</h2>
              <p className="chapter-text">
                I began seeking answers, not just to heal, but to understand why I am the way I am. Coming from a middle class family, I couldn’t always find answers at home. But that curiosity never left me.
              </p>
              <p className="chapter-text">
                Somewhere along the way, I discovered the writings of Marathi literary legend Va Pu Kale — and his views on life, relationships, work, and philosophy struck something deep within me.
              </p>
              <p className="chapter-text">
                In 6th grade, a life-changing teacher named Bhunje Sir introduced me to the lives and thoughts of great thinkers like Gandhi, Shaw, Einstein, and Socrates. From him, I learned something far beyond academics — I began learning how to live.
              </p>
            </div>
          </div>

          {/* --- CHAPTER THREE: Philosophy --- */}
          <div className="chapter-card">
             <div>
               <span className="chapter-tag tag-red">Chapter Three</span>
               <h2 className="chapter-title">Philosophy Became My Path</h2>
               <p className="chapter-text">
                 That early exposure made me realize that philosophy isn’t just theory — it’s a lens through which life makes more sense.
               </p>
               <p className="chapter-text">
                 I started learning from people who had done personal development courses. I absorbed what I could from them, and eventually began doing my own courses — and more importantly, I practiced deeply.
               </p>
               <p className="chapter-text">
                 I worked closely and voluntarily with teachers, coaches, and mentors for several years. This inner work became my foundation. I discovered tools to keep my past in the past, deal with issues powerfully, and find simplicity in thinking.
               </p>
             </div>
             <div className="full-width-image" style={{height: '320px', marginTop: 0}}>
               <img src={ImgThree} alt="Philosophy concept" className="about-image" />
             </div>
          </div>

          {/* --- CHAPTER FOUR: Loss --- */}
          <div className="chapter-card">
            <div className="about-image-wrapper">
               <img src={ImgFourth} alt="Resilience" className="about-image" />
             </div>
             <div>
               <span className="chapter-tag tag-blue">Chapter Four</span>
               <h2 className="chapter-title">Loss, Separation, and What Stayed With Me</h2>
               <p className="chapter-text">
                 Then life hit harder. My father passed away. That was a very tough time for me — emotionally, mentally, and personally.
               </p>
               <p className="chapter-text">
                 Soon after, my marriage ended. I have an adorable daughter — but eventually, I went through a separation that left me shattered. Losing her regular presence was one of the most painful experiences of my life.
               </p>
               <div className="highlight-text">
                 But the inner work I had done over the years became my anchor. The same tools and awareness helped me survive that pain.
               </div>
             </div>
          </div>

          {/* --- CHAPTER FIVE: Helping Others --- */}
          <div className="chapter-card">
             <div>
               <span className="chapter-tag tag-green">Chapter Five</span>
               <h2 className="chapter-title">From Healing Myself to Helping Others</h2>
               <p className="chapter-text">
                 I started sharing what I knew. People began opening up to me. They would come, talk, and leave lighter. Some even recommended their friends.
               </p>
               <p className="chapter-text">
                 I never planned to become a coach — it just happened organically. Now, it’s been over 13 years, and I’ve worked with people from all walks of life.
               </p>
               <p className="chapter-text" style={{fontWeight: 600}}>
                 They’ve gotten real results — clarity, emotional balance, better relationships, success, and inner peace.
               </p>
             </div>
             <div className="about-image-wrapper">
               <img src={ImgFifth} alt="Coaching session" className="about-image" />
             </div>
          </div>

          {/* --- CHAPTER SIX: Hardship & Resilience (Centered) --- */}
          {/* Note: chapter-centered-card has display:block!important in CSS to override grid */}
          <div className="chapter-card chapter-centered-card">
             <div className="chapter-centered-content">
               <span className="chapter-tag tag-red">Chapter Six</span>
               <h2 className="chapter-title">The Hardship & Resilience</h2>
               <div style={{ width: '50px', height: '2px', background: '#000', margin: '0 auto 2rem auto' }}></div>
               
               <p className="chapter-text">
                 But life wasn't done testing me. My father passed away suddenly. The ground beneath my feet crumbled. A relationship that I thought would last forever ended in separation.
               </p>
               <p className="chapter-text">
                 I was back in the fog. But this time, I had tools. The philosophy I had absorbed wasn't just theory anymore—it was survival.
               </p>
               <p className="chapter-text" style={{fontWeight: 700, fontSize: '1.25rem', marginTop: '2rem'}}>
                 I used the very principles that once saved me to rebuild myself. Slowly. Painfully. Deliberately.
               </p>
               <p className="chapter-text" style={{fontSize: '0.9rem', color: '#888', fontStyle: 'italic'}}>
                 And when I emerged, I knew my purpose.
               </p>
             </div>

             <div className="full-width-image">
               <img 
                 src={ImgSix} 
                 alt="Resilience Phoenix Concept" 
                 className="about-image"
                 style={{ objectPosition: 'center 30%' }}
               />
             </div>
          </div>

          {/* --- MISSION CARD --- */}
          <div className="mission-card">
            <div className="mission-bg-circle"></div>
            <div className="mission-content">
              <Heart size={48} className="mission-icon" fill="white" />
              <h2 className="mission-title">This Is My Mission</h2>
              <div className="mission-text">
                <p>To reach as many people as I can.</p>
                <p>To help them reconnect with their true self.</p>
                <p>To make Personal Growth practical, personal, and powerful.</p>
                <p className="mt-6">And to remind them:</p>
                <p className="italic text-white font-medium my-4">
                  Most people aren’t broken — they’re just unaware of what’s quietly running their lives.
                </p>
                <p>Once you see it, you can shift it. I’m here to help you do that.</p>
              </div>
              <Link to="/register"  className="link-black">
              <button className="mission-btn">          
                Start Your Journey Today <ArrowRight size={18} />
              </button>  </Link>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutSection;