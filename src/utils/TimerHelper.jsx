import React, { useState, useEffect } from 'react';
import {  Clock} from 'lucide-react';
import '../css/dashboard.css';

export const CountdownTimer =({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        if (days > 0) return `${days}d ${hours}h `;
        return `${hours}h ${minutes}m ${seconds}s`;
      }
      return "00h 00m";
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    
    //Update every second
    const secondTimer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(secondTimer) && clearInterval(timer);
  }, [targetDate]);

  return <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{timeLeft}</span>;
};

// --- Helper: Midnight Unlock Logic ---
export const GetUnlockDate = (createdAtString, dayNumber) => {
  // 1. Fallback if createdAtString is missing
  if (!createdAtString) return new Date();
  
  // 2. Parse the date
  const signupDate = new Date(createdAtString);
  
  // 3. Fallback if createdAtString was invalid (e.g., malformed string)
  if (isNaN(signupDate.getTime())) {
    return new Date(); 
  }

  // 4. Calculate Midnight
  const midnightBase = new Date(signupDate);
  midnightBase.setHours(0, 0, 0, 0);
  
  // 5. Add Days
  const unlockDate = new Date(midnightBase);
  unlockDate.setDate(midnightBase.getDate() + (dayNumber - 1));
  
  return unlockDate;

};



export const SpecialCountdownTimer = ({ expireTime }) => {
  const [minutesLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expireTime) - new Date();
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
      }
      return "00m 00s";
    };
    // Updates every second
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [expireTime]);

  return <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{minutesLeft}</span>;
};
