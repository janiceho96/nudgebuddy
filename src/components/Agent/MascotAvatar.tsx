import React from 'react';
import { AgentMood } from '../../types';

interface MascotAvatarProps {
  mood: AgentMood;
  size?: number;
  isTalking?: boolean;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({ mood, size = 48, isTalking = false, onClick }) => {
  const renderEyes = () => {
    switch (mood) {
      case 'hyped':
      case 'celebrating':
        return (
          <>
            {/* Joyful curved eyes */}
            <path d="M 28 40 Q 34 33 40 40" stroke="#1e293b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 48 40 Q 54 33 60 40" stroke="#1e293b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {/* Spark of clarity */}
            <circle cx="44" cy="24" r="2" fill="#818cf8" />
          </>
        );

      case 'worried':
        return (
          <>
            <circle cx="34" cy="40" r="3.5" fill="#1e293b" />
            <circle cx="54" cy="40" r="3.5" fill="#1e293b" />
            <circle cx="33" cy="38.5" r="1.2" fill="#ffffff" />
            <circle cx="53" cy="38.5" r="1.2" fill="#ffffff" />
            <path d="M 40 50 Q 44 47 48 50" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        );

      case 'sleeping':
        return (
          <>
            <line x1="28" y1="41" x2="38" y2="41" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="41" x2="60" y2="41" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'watching':
      case 'idle':
      default:
        return (
          <>
            {/* Serene mindful eyes */}
            <circle cx="34" cy="41" r="3.2" fill="#1e293b" />
            <circle cx="54" cy="41" r="3.2" fill="#1e293b" />
            <circle cx="35" cy="39.8" r="1" fill="#ffffff" />
            <circle cx="55" cy="39.8" r="1" fill="#ffffff" />
            {/* Gentle calm smile */}
            <path d="M 41 49 Q 44 52 47 49" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`mascot-avatar-container ${isTalking ? 'talking-mascot' : 'ethereal-spirit'}`}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      title="Sol — Your Mindful Focus Guide"
    >
      <svg
        viewBox="0 0 88 88"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="forestAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8f3dc" stopOpacity="1" />
            <stop offset="65%" stopColor="#b7e4c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#95d5b2" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id="forestCore" x1="0" y1="0" x2="88" y2="88">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0fdf4" />
          </linearGradient>
        </defs>

        {/* Soft Forest Halo */}
        <circle cx="44" cy="46" r="36" fill="url(#forestAura)" />

        {/* Cute Leaf Sprout Crown on top */}
        <path
          d="M 44 24 C 41 15 32 14 30 18 C 28 22 36 24 44 24 Z"
          fill="#40916c"
        />
        <path
          d="M 44 24 C 47 14 56 13 58 17 C 60 21 52 24 44 24 Z"
          fill="#52b788"
        />
        <line x1="44" y1="24" x2="44" y2="28" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" />

        {/* Inner Luminous Core */}
        <circle
          cx="44"
          cy="46"
          r="25"
          fill="url(#forestCore)"
          stroke="#b7e4c7"
          strokeWidth="1.5"
        />

        {/* Soft Blush Cheeks */}
        <circle cx="31" cy="49" r="3" fill="#fecdd3" opacity="0.8" />
        <circle cx="57" cy="49" r="3" fill="#fecdd3" opacity="0.8" />

        {/* Facial Expression */}
        {renderEyes()}
      </svg>
    </div>
  );
};
