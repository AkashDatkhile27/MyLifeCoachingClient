import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  '../../css/flashcards.css'
import userApiService from '../../apiServices/userDashboardApiService';

const MOCK_SESSIONS = [
    { _id: 's1', dayNumber: 1, title: "Reviling", type: "One:One", isCompleted: true, contextPoints: ["Reviling what they consider themselves", "Blind spots"] },
    { _id: 's2', dayNumber: 2, title: "Sparkling Noise", type: "Recorded", isCompleted: false, contextPoints: ["Realtime Navigation", "Clutter of thoughts"] },
    { _id: 's3', dayNumber: 3, title: "Unreasonable Life", type: "One:One", isCompleted: false, contextPoints: ["Courageous life", "Past impacting Decisions"] }
];
const Flashcards =  () => {
      const [sessions, setSessions] = useState([]);
    const [completedSessionIds, setCompletedSessionIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeSession, setActiveSession] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // --- FETCH DATA FROM API ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                // Fetch User (for progress) and Sessions (for content) in parallel
                const [userData, sessionsData] = await Promise.all([
                    userApiService.fetchUser(token),
                    userApiService.fetchSessions(token)
                ]);

                setSessions(sessionsData || []);
                setCompletedSessionIds(userData.completedSessions || []);
            } catch (err) {
                console.error("Flashcard Data Error:", err);
                setError("Failed to load flashcard content.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- DETERMINE ACTIVE SESSION ---
    useEffect(() => {
        if (sessions.length > 0) {
            const sorted = [...sessions].sort((a,b) => a.dayNumber - b.dayNumber);
            const nextSession = sorted.find(s => !completedSessionIds.includes(s._id)) || sorted[sorted.length - 1];
            setActiveSession(nextSession);
        }
    }, [sessions, completedSessionIds]);

    if (loading) return <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin"/></div>;
    if (error) return <div style={{textAlign:'center', padding:40}}><AlertCircle size={40} style={{margin:'0 auto 10px', color:'#ef4444'}}/><p>{error}</p></div>;
    if (!activeSession) return <div style={{textAlign:'center', padding:40}}>No sessions available.</div>;

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
                <p className="fc-subtitle">Focus for <strong>{activeSession.title}</strong></p>
            </div>
            
            <div className="fc-card-container" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`fc-flashcard ${isFlipped ? 'flipped' : ''}`}>
                    {/* Front */}
                    <div className="fc-card-face card-front">
                        <div className="fc-card-label"><Lightbulb size={16}/> Concept {currentIndex + 1}</div>
                        <div className="fc-card-text">Tap to reveal insight</div>
                        <div style={{marginTop:'auto', fontSize:'0.8rem', opacity:0.5}}>Click to flip</div>
                    </div>
                    {/* Back */}
                    <div className="fc-card-face fc-card-back">
                        <div className="fc-card-label" style={{color:'#666'}}><Zap size={16}/> Key Learning</div>
                        <div className="fc-card-text">"{points[currentIndex]}"</div>
                    </div>
                </div>
            </div>

            <div className="fc-controls">
                <button className="fc-ctrl-btn" onClick={handlePrev} disabled={currentIndex === 0}><ChevronLeft size={24}/></button>
                <div className="fc-progress-bar"><div className="fc-progress-fill" style={{ width: `${progress}%` }}></div></div>
                <button className="fc-ctrl-btn" onClick={handleNext} disabled={currentIndex === points.length - 1}><ChevronRight size={24}/></button>
            </div>
            
            <button className="fc-ctrl-btn" style={{marginTop:'20px', width:'auto', padding:'0 20px', borderRadius:'99px', fontSize:'0.9rem'}} onClick={() => {setCurrentIndex(0); setIsFlipped(false);}}>
                <RotateCcw size={16} style={{marginRight:8}}/> Restart Deck
            </button>
        </div>
    );
};
export default Flashcards;