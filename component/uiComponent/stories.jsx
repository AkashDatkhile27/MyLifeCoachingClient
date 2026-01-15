import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../css/stories.css'; // Make sure this matches your CSS filename

function Stories() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      // Dynamic calculation: Get width of the first card + gap (32px/2rem)
      // This ensures we scroll exactly one card width regardless of screen size
      const cardWidth = container.firstElementChild?.clientWidth || 300;
      const gap = 32; 
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  return (
    <section className="section-stories">
      <style>[styles]</style>
      <div className="section-title-wrapper">
        <h2 className="section-title">What people are saying </h2>
      </div>
      
      <div className="stories-wrapper">
        <button 
          className="scroll-btn left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="stories-grid" ref={scrollContainerRef}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div className="story-card" key={i}>
              <div className="story-header">
                <div 
                  className="story-avatar" 
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/150?img=${i + 15})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div>
                  <div className="story-name">Participant {i}</div>
                  <div className="story-role">Member</div>
                </div>
              </div>
              <p className="story-quote">"This program completely shifted my perspective. I finally feel in control of my life. It was a smooth process."</p>
              <div className="stars">★★★★★</div>
            </div>
          ))}
        </div>

        <button 
          className="scroll-btn right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

export default Stories;