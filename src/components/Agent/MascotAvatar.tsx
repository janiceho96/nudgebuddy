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
          <radialGradient id="solAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eef2ff" stopOpacity="1" />
            <stop offset="65%" stopColor="#e0e7ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id="solCore" x1="0" y1="0" x2="88" y2="88">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        {/* Soft Ethereal Outer Halo */}
        <circle cx="44" cy="44" r="38" fill="url(#solAura)" />

        {/* Inner Luminous Core */}
        <circle
          cx="44"
          cy="44"
          r="26"
          fill="url(#solCore)"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />

        {/* Subtle Iris Crown Node */}
        <circle cx="44" cy="18" r="3" fill="#6366f1" opacity="0.85" />
        <circle cx="44" cy="18" r="5" stroke="#818cf8" strokeWidth="0.8" opacity="0.5" />

        {/* Facial Expression */}
        {renderEyes()}
      </svg>
    </div>
  );
};
