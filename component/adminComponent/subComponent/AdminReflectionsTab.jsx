import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageSquare, Send, Calendar, User, Clock, CheckCircle, 
    Search, Filter, SlidersHorizontal, ChevronRight, RefreshCw, ChevronLeft
} from 'lucide-react';
import adminApiService from '../../../apiServices/adminDashboardApiService'; 
import adminStyles from '../../../css/adminReflection.css';
import { getInitials } from '../../../utils/getUserSessionStatusAndInitials';

const AdminReflectionsTab = () => {
 const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'replied'
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // --- API CALLS ---
  const fetchReflections = async () => {
    setLoading(true);
    try {
        const token = sessionStorage.getItem('token');
        const data = await adminApiService.fetchReflections(token);
        setReflections(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("Fetch error", err);
        // Fallback Mock Data
       
    } finally {
        setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    setSending(true);
    try {
        const token = sessionStorage.getItem('token');
        const payload = { reflectionId: selectedId, replyText };
        
        await adminApiService.replyToReflection(payload, token);
        
        setReflections(prev => prev.map(r => {
            if (r._id === selectedId) {
                let currentReplies = [];
                if (Array.isArray(r.adminReply)) {
                    currentReplies = r.adminReply;
                } else if (r.adminReply) {
                    currentReplies = [{ text: r.adminReply, date: r.lastUpdated }];
                }

                return { 
                    ...r, 
                    status: 'replied', 
                    adminReply: [...currentReplies, { text: replyText, date: new Date().toISOString() }], 
                    lastUpdated: new Date().toISOString() 
                };
            }
            return r;
        }));
        setReplyText('');
    } catch (err) {
        console.error("Reply error", err);
        alert("Failed to send reply");
    } finally {
        setSending(false);
    }
  };

  useEffect(() => { fetchReflections(); }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedId, reflections]);

  // --- FILTER LOGIC ---
  const filteredList = reflections.filter(item => {
      const matchesFilter = filter === 'all' ? true : item.status === filter;
      const matchesSearch = item.userId?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.sessionId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
  });

  // --- GROUPING LOGIC ---
  const groupedReflections = Object.values(filteredList.reduce((acc, item) => {
      const uId = item.userId?._id || 'unknown';
      if (!acc[uId]) {
          acc[uId] = {
              user: item.userId || { Name: 'Unknown User' },
              sessions: []
          };
      }
      acc[uId].sessions.push(item);
      return acc;
  }, {})).sort((a, b) => a.user.Name.localeCompare(b.user.Name)); // Sort users alphabetically

  const selectedReflection = reflections.find(r => r._id === selectedId);

  // Helper to construct conversation timeline
  const getConversation = (reflection) => {
      if (!reflection) return [];
      
      const userMsgs = Array.isArray(reflection.content) 
          ? reflection.content.map(m => ({ ...m, type: 'user' })) 
          : (reflection.content ? [{ text: reflection.content, date: reflection.lastUpdated, type: 'user' }] : []);

      const adminMsgs = Array.isArray(reflection.adminReply) 
          ? reflection.adminReply.map(m => ({ ...m, type: 'admin' })) 
          : (reflection.adminReply ? [{ text: reflection.adminReply, date: reflection.lastUpdated, type: 'admin' }] : []);

      return [...userMsgs, ...adminMsgs].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getPreviewText = (content) => {
      if (Array.isArray(content) && content.length > 0) return content[content.length - 1].text;
      if (typeof content === 'string') return content;
      return 'No content';
  };

  const conversation = getConversation(selectedReflection);
  return (
<div className="admin-reflections-layout fade-up">
          <style>[adminStyles]</style>

        <div className={`ar-sidebar ${selectedId ? 'mobile-hidden' : ''}`}>
        <div className="ar-header">
            <h3 style={{margin:'0 0 12px 0', fontSize:'1.2rem', fontWeight:'700'}}>Inbox</h3>
            <div className="ar-search-box">
                <Search size={16} color="#94a3b8"/>
                <input 
                    className="ar-search-input" 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="ar-filters">
                {['all', 'pending', 'replied'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)} 
                        className={`ar-filter-btn ${filter === f ? 'active' : ''}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="ar-list">
            {loading ? <div style={{padding:20, textAlign:'center', color:'#666'}}>Loading reflections...</div> : 
             filteredList.length === 0 ? <div style={{padding:30, textAlign:'center', color:'#666', fontStyle:'italic'}}>No reflections found</div> :
             
             /* RENDER GROUPS */
             groupedReflections.map(group => (
                <div key={group.user._id || 'unknown'} className="ar-group-container">
                    <div className="ar-group-header">
                        <div className="ar-group-avatar">
                            {getInitials(group.user.Name)}
                        </div>
                        <div className="ar-group-info">
                            <div className="ar-group-name">{group.user.Name}</div>
                            <div className="ar-group-count">{group.sessions.length} Session{group.sessions.length !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div className="ar-group-items">
                        {group.sessions.map(item => (
                            <div 
                                key={item._id} 
                                onClick={() => setSelectedId(item._id)}
                                className={`ar-nested-item ${selectedId === item._id ? 'active' : ''} ${item.status === 'pending' ? 'unread' : ''}`}
                            >
                                <div className="ar-nested-header">
                                    <div className="ar-nested-title">
                                        <Calendar size={10} color={selectedId === item._id ? '#ffffff' : '#888888'}/> 
                                        {item.sessionId?.title || 'Unknown Session'}
                                    </div>
                                    <div className="ar-nested-date">{new Date(item.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                </div>
                                <div className="ar-nested-preview">{getPreviewText(item.content)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
            }
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className={`ar-main ${selectedId ? 'mobile-active' : ''}`}>
        {selectedReflection ? (
            <>
                <div className="ar-detail-header">
                    <button className="ar-back-btn" onClick={() => setSelectedId(null)}>
                        <ChevronLeft size={24} />
                    </button>
                    <div className="ar-user-profile">
                        <div className="ar-avatar-lg">{getInitials(selectedReflection.userId?.Name)}</div>
                        <div>
                            <h2 style={{margin:0, fontSize:'1.1rem', color:'#f1f5f9'}}>{selectedReflection.userId?.Name}</h2>
                            <div style={{display:'flex', alignItems:'center', gap:6, color:'#94a3b8', fontSize:'0.8rem', marginTop:4}}>
                                <Clock size={12}/> Updated {new Date(selectedReflection.lastUpdated).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div className={`ar-status-badge ${selectedReflection.status}`}>
                        {selectedReflection.status}
                    </div>
                </div>

                <div className="ar-scroll-content" ref={scrollRef}>
                    <div className="ar-context-card">
                        <div className="ar-context-label">SESSION TOPIC</div>
                        <div className="ar-context-text">{selectedReflection.sessionId?.title}</div>
                    </div>

                    {conversation.length > 0 ? (
                        conversation.map((msg, idx) => (
                            <div key={idx} className={`ar-bubble ${msg.type}`}>
                                <span className="ar-bubble-meta">
                                    {msg.type === 'user' ? 'Student' : 'You'} • {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <div className="ar-bubble-text">{msg.text}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{color:'#666', fontStyle:'italic', textAlign:'center', padding:20}}>No messages found.</div>
                    )}
                </div>

                <div className="ar-reply-box">
                    <textarea 
                        className="ar-textarea" 
                        placeholder="Type your feedback here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendReply();
                            }
                        }}
                    />
                    <button 
                        className="btn btn-reply" 
                        onClick={sendReply}
                        disabled={sending || !replyText.trim()}
                        title="Send Reply (Enter)"
                    >
                        {sending ? <RefreshCw className="animate-spin" size={20}/> : <Send size={20}/>}
                    </button>
                </div>
            </>
        ) : (
            <div className="ar-main-empty">
                <div style={{
                    width:80, height:80, borderRadius:'50%', backgroundColor:'#1e293b', 
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16
                }}>
                    <MessageSquare size={40} color="#64748b" />
                </div>
                <h3 style={{margin:0, color:'#f1f5f9'}}>No Reflection Selected</h3>
                <p style={{margin:0}}>Select a student from the sidebar to view their reflection and provide feedback.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminReflectionsTab;