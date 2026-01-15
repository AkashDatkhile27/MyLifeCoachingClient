import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  '../../css/flashcards.css'
import userApiService from '../../apiServices/userDashboardApiService';
const Flashcards =  ({ sessions = [], userCreatedAt }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeSession, setActiveSession] = useState(null);

    // --- TIME-BASED UNLOCK LOGIC (MOVED HERE) ---
    useEffect(() => {
        if (sessions.length > 0 && userCreatedAt) {
            const sorted = [...sessions].sort((a,b) => a.dayNumber - b.dayNumber);
            const now = new Date();
            
            // Normalize join date to start of the day (00:00:00)
            const joinDate = new Date(userCreatedAt);
            const startOfJoinDate = new Date(joinDate);
            startOfJoinDate.setHours(0, 0, 0, 0);

            console.log("Current Time:", now);
            console.log("Join Date (Normalized 00:00):", startOfJoinDate);

            // Unlock logic: Unlock at 00:00 AM of the specific day
            // Day 1 unlocks at 00:00 AM of Join Date
            // Day 2 unlocks at 00:00 AM of (Join Date + 1 day)
            const currentSession = sorted.reduce((latest, session) => {
                const unlockDate = new Date(startOfJoinDate.getTime() + (session.dayNumber - 1) * 24 * 60 * 60 * 1000);
                if (now >= unlockDate) {
                    return session;
                }
                return latest;
            }, sorted[0]); 

            setActiveSession(currentSession);
        }
    }, [sessions, userCreatedAt]);

    // Reset card state when session changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [activeSession?._id]);

    if (!activeSession) return <div style={{textAlign:'center', padding:40}}>Loading active session...</div>;

    const points = activeSession.contextPoints || ["No flashcards available"];
    const progress = ((currentIndex + 1) / points.length) * 100;

    const handleNext = () => {
        if (currentIndex < points.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 300);
        }
    };

    return (
        <div className="flashcard-page">
            <div className="fc-header">
                <h1 className="fc-title">Daily Flashcards</h1>
                <p className="fc-subtitle">
                    Current Focus: <span style={{color:'#fff', fontWeight:'bold'}}>{activeSession.title}</span> (Day {activeSession.dayNumber})
                </p>
            </div>
            
            <div className="fc-card-container" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`fc-flashcard ${isFlipped ? 'flipped' : ''}`}>
                    <div className="fc-card-face fc-card-front">
                        <div className="fc-card-label"><Lightbulb size={16}/> Concept {currentIndex + 1}</div>
                        <div className="fc-card-text">Tap to reveal insight</div>
                        <div style={{marginTop:'auto', fontSize:'0.8rem', opacity:0.5}}>Click to flip</div>
                    </div>
                    <div className="fc-card-face fc-card-back">
                        <div className="fc-card-label" style={{color:'#666'}}><Zap size={16}/> Key Learning</div>
                        <div className="fc-card-text">"{points[currentIndex]}"</div>
                    </div>
                </div>
            </div>

            <div className="fc-controls">
                <button className="fc-ctrl-btn" onClick={handlePrev} disabled={currentIndex === 0}><ChevronLeft size={24}/></button>
                <div className="fc-progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                <button className="fc-ctrl-btn" onClick={handleNext} disabled={currentIndex === points.length - 1}><ChevronRight size={24}/></button>
            </div>
            
            <button className="fc-ctrl-btn" style={{marginTop:'20px', width:'auto', padding:'0 20px', borderRadius:'99px', fontSize:'0.9rem'}} onClick={() => {setCurrentIndex(0); setIsFlipped(false);}}>
                <RotateCcw size={16} style={{marginRight:8}}/> Restart Deck
            </button>
        </div>
    );
};
export default Flashcards;