import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import '../../css/dashboard.css';
import CryptoJS from 'crypto-js'; 

const decryptUrl = (encryptedData) => {
  if (!encryptedData) return null;
  // If plain URL (http/https), return it directly.
  else if (encryptedData.startsWith('http')) return encryptedData;

  // --- UNCOMMENT THIS BLOCK LOCALLY AFTER INSTALLING crypto-js ---
  else {
  try {
    // If it doesn't look like "iv:ciphertext", return original (fallback)
    if (!encryptedData.includes(':')) {
        return encryptedData;
    }
    
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const secret = 'my_super_secure_secret_key_12345'; // MUST MATCH BACKEND KEY
    
    // Key Derivation: SHA-256 (matches backend)
    const key = CryptoJS.SHA256(secret);
    
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted },
      key,
      { 
        iv: iv, 
        mode: CryptoJS.mode.CBC, 
        padding: CryptoJS.pad.Pkcs7 
      }
    );
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    // If result is empty string, decryption failed or data was empty; fallback to input
    return result || encryptedData;
  } catch (e) {
    console.error("Decryption failed:", e);
    // Return original data to gracefully fail
    return encryptedData;
  }
}
  
  // For Preview (Simulated): Return raw data
  // return encryptedData; 
};


const AudioPlayerModal =  ({ isOpen, onClose, session, onComplete }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPlayer(null);
      setIsPlaying(false);
      setIsReady(false);
    }
  }, [isOpen]);

  const getVideoId = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      } else if (url.includes('/embed/')) {
        return url.split('/embed/')[1].split('?')[0];
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  useEffect(() => {
    if (!isOpen || !session) return;

    const rawMediaUrl = decryptUrl(session.mediaUrl);
    const videoId = getVideoId(rawMediaUrl);

    if (!videoId) return;

    const initPlayer = () => {
      if (!document.getElementById('yt-player-mount')) return;
      if (player) return;

      const newPlayer = new window.YT.Player('yt-player-mount', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'disablekb': 1,
          'fs': 0,
          'rel': 0,
          'modestbranding': 1,
          'iv_load_policy': 3,
          'origin': window.location.origin
        },
        events: {
          'onReady': (event) => {
            setPlayer(event.target);
            setIsReady(true);
          },
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) setIsPlaying(false);
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      setTimeout(initPlayer, 100);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const togglePlay = () => {
    if (player && isReady) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      backdropFilter: 'blur(10px)',
      padding: '16px' 
    }}>
      <div style={{
        background: '#111', 
        width: '100%', 
        maxWidth: '500px', 
        borderRadius: '24px', 
        border: '1px solid #333', 
        overflow: 'hidden', 
        padding: '24px', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <span style={{width:'8px', height:'8px', background: isPlaying ? '#22c55e' : '#666', borderRadius:'50%', boxShadow: isPlaying ? '0 0 10px #22c55e' : 'none', transition: 'all 0.3s'}}></span>
            <h3 style={{color:'white', fontWeight:'600', letterSpacing:'0.5px', fontSize:'0.9rem', textTransform:'uppercase'}}>
              {isPlaying ? "Now Playing" : "Audio Session"}
            </h3>
          </div>
          <button onClick={onClose} style={{background:'#222', border:'none', color:'#fff', cursor:'pointer', padding:'8px', borderRadius:'50%'}}>
            <X size={20} />
          </button>
        </div>

        <div 
          onClick={togglePlay}
          style={{
            position: 'relative', 
            width: '100%', 
            aspectRatio: '16/9',
            background: '#000', 
            borderRadius: '16px', 
            overflow: 'hidden',
            marginBottom: '24px',
            border: '1px solid #222',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div style={{ 
            pointerEvents: 'none', 
            width: '100%', 
            height: '100%',
            filter: 'blur(30px) brightness(0.4) grayscale(100%)', 
            transform: 'scale(1.3)'
          }}>
            <div id="yt-player-mount"></div>
          </div>
          
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10
          }}>
            <div style={{
              width:'64px', height:'64px', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(5px)',
              borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              marginBottom:'12px', border:'1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.2s',
              transform: isPlaying ? 'scale(0.95)' : 'scale(1)'
            }}>
              {isPlaying ? <Pause size={28} color="white" fill="white" /> : <Play size={28} color="white" fill="white" style={{marginLeft:'4px'}} />}
            </div>
            <span style={{color:'rgba(255,255,255,0.9)', fontSize:'0.85rem', fontWeight:'500'}}>
              {isReady ? (isPlaying ? "Tap to Pause" : "Tap to Play") : "Loading Audio..."}
            </span>
          </div>
        </div>

        <div style={{textAlign:'center', marginBottom:'24px'}}>
          <h2 style={{color:'white', fontWeight:'700', fontSize:'1.1rem', marginBottom:'6px', lineHeight:'1.3'}}>{session.title}</h2>
          <p style={{color:'#666', fontSize:'0.8rem', fontFamily:'monospace'}}>DAY {session.dayNumber} • AUDIO ONLY</p>
        </div>

        <button onClick={() => onComplete(session._id)} className="btn1 btnprimary" style={{width:'100%', padding:'14px', fontSize:'0.95rem', borderRadius:'12px'}}>
          Mark Complete & Finish
        </button>
      </div>
    </div>
  );}

export default AudioPlayerModal