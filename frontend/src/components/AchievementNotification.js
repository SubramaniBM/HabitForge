import React, { useEffect, useState } from 'react';
import './AchievementNotification.css';

const AchievementNotification = ({ badge, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Play achievement sound (simple beep using Web Audio API)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Silently fail if audio not supported
      console.log('Audio not supported');
    }

    // Trigger animation
    setTimeout(() => setVisible(true), 100);

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!badge) return null;

  return (
    <div className={`achievement-notification ${visible ? 'visible' : ''}`}>
      <div className="achievement-glow"></div>
      <div className="achievement-content">
        <div className="achievement-header">
          <div className="achievement-label">Achievement Unlocked</div>
          <div className="achievement-points">+25G</div>
        </div>
        <div className="achievement-body">
          <div className="achievement-icon">
            <div className="icon-glow"></div>
            <span className="icon-emoji">{badge.icon}</span>
          </div>
          <div className="achievement-info">
            <div className="achievement-name">{badge.name}</div>
            <div className="achievement-description">{badge.description}</div>
          </div>
        </div>
      </div>
      <div className="achievement-shine"></div>
    </div>
  );
};

export default AchievementNotification;
