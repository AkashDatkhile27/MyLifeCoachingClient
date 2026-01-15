import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Lock, MessageSquare, Send, Lightbulb, Clock, CheckCircle, ChevronLeft, Bell } from 'lucide-react';

import userStyles from '../../css/userReflection.css';
import userApiService from '../../apiServices/userDashboardApiService';

// Mock Admin Shares (In a real app, this would be fetched with session data)
const MOCK_ADMIN_SHARES = {
    's1': "Remember, the 'Why' isn't just about money or status. It's about the feeling you get when you achieve it. Focus on that feeling today.",
    's2': "Failure is just data. When you hit a barrier today, note it down as an observation, not a judgment."
};

const UserReflections =({ sessions, user, initialSessionId }) => {
   const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId || sessions?.[0]?._id);
  const [thoughtText, setThoughtText] = useState('');
  const [myThoughts, setMyThoughts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scrollEndRef = useRef(null); // Ref for auto-scrolling

  // Update selected session if prop changes
  useEffect(() => { 
    if (initialSessionId) setSelectedSessionId(initialSessionId); 
  }, [initialSessionId]);

  // Fetch Reflections on Mount & Background Refresh
  useEffect(() => {
    let isMounted = true;

    const fetchReflections = async (isBackground = false) => {
        try {
            // Only show loading spinner on initial load, not background refreshes
            if (!isBackground) setLoading(true);
            
            const token = sessionStorage.getItem('token');
            const data = await userApiService.fetchReflections(token);
            
            if (isMounted) {
                setMyThoughts(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to load reflections", err);
        } finally {
            if (isMounted && !isBackground) setLoading(false);
        }
    };

    // Initial Fetch
    fetchReflections();

    // Setup polling every 30 seconds
    const intervalId = setInterval(() => {
        fetchReflections(true);
    }, 30000);

    // Cleanup interval on unmount
    return () => {
        isMounted = false;
        clearInterval(intervalId);
    };
  }, []);

  // Safe access to sessions
  const safeSessions = sessions || [];
  const selectedSession = safeSessions.find(s => s._id === selectedSessionId);
  
  // Find the single reflection document for this session
  const currentReflection = myThoughts.find(t => t.sessionId === selectedSessionId);

  // Derive message list from the content array
  // Data structure: [{ text: "...", date: "..." }, ...]
  const sessionMessages = [];

  if (currentReflection) {
      // 1. Add User Messages
      if (Array.isArray(currentReflection.content)) {
          currentReflection.content.forEach(msg => {
              sessionMessages.push({
                  type: 'user',
                  text: msg.text || msg.content, // handle potential inconsistencies
                  date: msg.date || currentReflection.lastUpdated
              });
          });
      } else if (typeof currentReflection.content === 'string') {
          // Backward compatibility: handle legacy string content
          sessionMessages.push({
              type: 'user',
              text: currentReflection.content,
              date: currentReflection.date || currentReflection.lastUpdated
          });
      }

      // 2. Add Admin Reply (if exists)
      // Updated to handle array of admin replies based on conversation
      if (Array.isArray(currentReflection.adminReply)) {
          currentReflection.adminReply.forEach(msg => {
              sessionMessages.push({
                  type: 'admin',
                  text: msg.text || msg,
                  date: msg.date || currentReflection.lastUpdated
              });
          });
      } else if (currentReflection.adminReply) {
           // Fallback for single string reply
          sessionMessages.push({
              type: 'admin',
              text: currentReflection.adminReply,
              date: currentReflection.lastUpdated 
          });
      }
  }

  // Sort by date to ensure correct chat order
  sessionMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

  const adminShare = MOCK_ADMIN_SHARES[selectedSessionId]; 

  const handleSubmit = async () => {
    if (!thoughtText.trim()) return;
    
    setSubmitting(true);
    const token = sessionStorage.getItem('token');
    
    // Payload still sends text, backend expected to push to array
    const payload = { 
        sessionId: selectedSessionId, 
        content: thoughtText 
    };

    try {
        const response = await userApiService.createOrUpdateReflection(payload, token);
        
        // Optimistic UI Update:
        // We need to update the single document for this session by appending to its content array
        setMyThoughts(prev => {
            const existingIndex = prev.findIndex(t => t.sessionId === selectedSessionId);
            const newMessage = { 
                text: thoughtText, 
                date: new Date().toISOString() 
            };

            if (existingIndex >= 0) {
                const updated = [...prev];
                const doc = updated[existingIndex];
                
                // Ensure content is an array
                const currentContent = Array.isArray(doc.content) 
                    ? doc.content 
                    : (doc.content ? [{ text: doc.content, date: doc.date }] : []);

                updated[existingIndex] = {
                    ...doc,
                    content: [...currentContent, newMessage],
                    lastUpdated: new Date().toISOString()
                };
                return updated;
            } else {
                // Create new document structure
                return [...prev, {
                    sessionId: selectedSessionId,
                    content: [newMessage],
                    status: 'pending',
                    adminReply: null,
                    lastUpdated: new Date().toISOString()
                }];
            }
        });
        
        setThoughtText('');
    } catch (err) {
        console.error("Failed to submit reflection", err);
        alert("Failed to save reflection. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };

  // Date Formatting Helper
  const formatDateTime = (dateString) => {
      if(!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!sessions || sessions.length === 0) {
      return (
        <div className="reflections-container">
            <style>{userStyles}</style>
            <div className="empty-state" style={{margin: 'auto'}}>
                <MessageSquare size={48} />
                <p>No sessions available to reflect on yet.</p>
            </div>
        </div>
      );
  }

  // --- MOBILE TOGGLE LOGIC ---
  // If selectedSessionId is present, we are in "chat mode" on mobile.
  // If null, we are in "list mode".
  // Desktop always shows both.

  return (
    <div className="reflections-container fade-up">
      <style>[userStyles]</style>
      
      {/* LEFT SIDE: Session List */}
      <div className={`reflections-sidebar ${selectedSessionId ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-header">
            <h3>My Journal</h3>
            <p>Reflect on your daily journey</p>
        </div>
        <div className="session-list-scroll">
          {sessions.map(session => {
            // Find reflection doc
            const doc = myThoughts.find(t => t.sessionId === session._id);
            const hasThought = doc && (Array.isArray(doc.content) ? doc.content.length > 0 : !!doc.content);
            const hasReply = doc && (Array.isArray(doc.adminReply) ? doc.adminReply.length > 0 : !!doc.adminReply);
            
            // --- LOCKING LOGIC ---
            const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
            const unlockTime = new Date(joinDate.getTime() + (session.dayNumber - 1) * 24 * 60 * 60 * 1000);
            const expiryTime = new Date(unlockTime.getTime() + 24 * 60 * 60 * 1000); 
            
            const now = new Date();
            const isMissed = now > expiryTime;
            const isUnlocked = session.isCompleted || isMissed; 
            const isLocked = !isUnlocked;

            return (
              <div 
                key={session._id} 
                onClick={() => !isLocked && setSelectedSessionId(session._id)} 
                className={`journal-item ${selectedSessionId === session._id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
              >
                <div className="journal-meta">
                    <span className="day-label">Day {session.dayNumber}</span>
                    {hasReply && <span className="reply-badge">New Msg</span>}
                </div>
                <div className="journal-title">
                    {isLocked ? <Lock size={12} style={{marginRight:6}}/> : <Calendar size={12} style={{marginRight:6}}/>}
                    {session.title}
                </div>
                <div className="journal-preview">
                    {isLocked ? "Complete session to unlock" : (hasThought ? "View entries..." : "Start writing...")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: Content Area */}
      {/* Use mobile-active class to show this section on mobile when an ID is selected */}
      <div className={`reflection-main ${selectedSessionId ? 'mobile-active' : ''}`}>
        {selectedSessionId ? (
            <>
                <div className="reflection-header">
                    <button className="back-btn" onClick={() => setSelectedSessionId(null)}>
                        <ChevronLeft size={24} />
                    </button>
                    <div className="header-content">
                        <span className="topic-label">SESSION TOPIC</span>
                        <h2>{selectedSession?.title || 'Loading...'}</h2>
                        <div className="context-pills">
                            {selectedSession?.contextPoints?.slice(0, 2).map((p, i) => (
                                <span key={i} className="pill">{p}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="reflection-scroll-area">
                    {/* Coach Insight Card */}
                    {adminShare && (
                        <div className="coach-note-card">
                            <div className="note-header"><Lightbulb size={16} /> Coach's Insight</div>
                            <div className="note-content">"{adminShare}"</div>
                        </div>
                    )}

                    {/* Chat History */}
                    {sessionMessages.length > 0 ? (
                        sessionMessages.map((msg, index) => (
                            <React.Fragment key={index}>
                                {msg.type === 'user' ? (
                                    /* User's Message (Left) */
                                    <div className="message-bubble user">
                                        <div className="bubble-header">My Reflection</div>
                                        <div className="bubble-content">{msg.text}</div>
                                        <div className="bubble-footer">
                                            {formatDateTime(msg.date)}
                                        </div>
                                    </div>
                                ) : (
                                    /* Coach's Reply (Right) */
                                    <div className="message-bubble admin">
                                        <div className="bubble-header">
                                            <CheckCircle size={14} style={{marginRight:4}}/> Coach Reply
                                        </div>
                                        <div className="bubble-content">{msg.text}</div>
                                        <div className="bubble-footer">
                                            {formatDateTime(msg.date)} 
                                        </div>
                                    </div>
                                )}
                                
                                {/* Status Indicator for last message if it's user sent and no reply yet */}
                                {index === sessionMessages.length - 1 && msg.type === 'user' && !currentReflection?.adminReply && (
                                    <div className="status-indicator">
                                        <Clock size={14}/> Sent. Waiting for coach feedback...
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="empty-placeholder">
                            <div style={{
                                width:60, height:60, borderRadius:'50%', background:'#111', 
                                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto'
                            }}>
                                <MessageSquare size={30} color="#666"/>
                            </div>
                            <p>What did you learn from today's session?<br/>Write your thoughts below.</p>
                        </div>
                    )}
                    <div ref={scrollEndRef} />
                </div>

                {/* Input Area */}
                <div className="reflection-input-area">
                    <textarea 
                        className="journal-input" 
                        placeholder={sessionMessages.length > 0 ? "Add another reflection..." : "Write your reflection here..."}
                        value={thoughtText}
                        onChange={(e) => setThoughtText(e.target.value)}
                        disabled={submitting}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <button 
                        className="btn1 btnprimary icon-only" 
                        onClick={handleSubmit} 
                        disabled={!thoughtText.trim() || submitting}
                    >
                        {submitting ? <div className="spinner-sm"></div> : <Send size={20} />}
                    </button>
                </div>
            </>
        ) : (
            /* Desktop Empty State (When no session selected, though usually one is default) */
            <div className="empty-state">
                <p>Select a session from the list to view or add reflections.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserReflections;