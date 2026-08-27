import React from 'react';
import { AgentMood } from '../../types';

interface MascotAvatarProps {
  mood: AgentMood;
  size?: number;
  isTalking?: boolean;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({ mood, size = 64, isTalking = false, onClick }) => {
  const renderEyesAndMouth = () => {
    if (isTalking) {
      return (
        <>
          <circle cx="28" cy="40" r="4.5" fill="#242e28" />
          <circle cx="52" cy="40" r="4.5" fill="#242e28" />
          <circle cx="29.5" cy="38.5" r="1.6" fill="#ffffff" />
          <circle cx="53.5" cy="38.5" r="1.6" fill="#ffffff" />
          {/* Gentle talking mouth */}
          <ellipse cx="40" cy="52" rx="5" ry="3.5" fill="#242e28" />
          <ellipse cx="40" cy="53" rx="3" ry="1.8" fill="#f5cac3" />
        </>
      );
    }

    switch (mood) {
      case 'watching':
        return (
          <>
            <circle cx="28" cy="40" r="4.5" fill="#242e28" />
            <circle cx="52" cy="40" r="4.5" fill="#242e28" />
            <circle cx="29.5" cy="38.5" r="1.6" fill="#ffffff" />
            <circle cx="53.5" cy="38.5" r="1.6" fill="#ffffff" />
            <line x1="34" y1="52" x2="46" y2="52" stroke="#242e28" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="20" cy="45" r="3.5" fill="#f5cac3" opacity="0.75" />
            <circle cx="60" cy="45" r="3.5" fill="#f5cac3" opacity="0.75" />
          </>
        );

      case 'hyped':
        return (
          <>
            <circle cx="28" cy="38" r="5" fill="#242e28" />
            <circle cx="52" cy="38" r="5" fill="#242e28" />
            <circle cx="29" cy="36.5" r="2" fill="#dfb15b" />
            <circle cx="53" cy="36.5" r="2" fill="#dfb15b" />
            <path d="M 30 48 Q 40 58 50 48" stroke="#242e28" strokeWidth="2.2" fill="#fdfbf7" strokeLinecap="round" />
            <circle cx="18" cy="44" r="4" fill="#f5cac3" opacity="0.9" />
            <circle cx="62" cy="44" r="4" fill="#f5cac3" opacity="0.9" />
          </>
        );

      case 'judging':
        return (
          <>
            <ellipse cx="28" cy="40" rx="5" ry="3" fill="#242e28" />
            <ellipse cx="52" cy="40" rx="5" ry="3" fill="#242e28" />
            <path d="M 33 52 Q 41 50 47 53" stroke="#242e28" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 23 32 Q 28 30 33 34" stroke="#242e28" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );

      case 'worried':
        return (
          <>
            <circle cx="28" cy="39" r="5" fill="#242e28" />
            <circle cx="52" cy="39" r="5" fill="#242e28" />
            <circle cx="26.5" cy="37.5" r="1.8" fill="#ffffff" />
            <circle cx="50.5" cy="37.5" r="1.8" fill="#ffffff" />
            <path d="M 34 53 Q 40 48 46 53" stroke="#242e28" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        );

      case 'celebrating':
        return (
          <>
            <path d="M 23 40 Q 28 34 33 40" stroke="#242e28" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 47 40 Q 52 34 57 40" stroke="#242e28" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 30 47 Q 40 60 50 47 Z" fill="#242e28" />
            <circle cx="18" cy="43" r="4.5" fill="#f5cac3" />
            <circle cx="62" cy="43" r="4.5" fill="#f5cac3" />
            <text x="61" y="24" fontSize="12">🍵</text>
            <text x="4" y="25" fontSize="12">✨</text>
          </>
        );

      case 'sleeping':
        return (
          <>
            <line x1="23" y1="40" x2="33" y2="40" stroke="#242e28" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="47" y1="40" x2="57" y2="40" stroke="#242e28" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="40" cy="51" rx="2.5" ry="1.5" fill="#242e28" />
            <text x="56" y="22" fontSize="11" fontWeight="600" fill="#84a98c">Zzz</text>
          </>
        );

      case 'idle':
      default:
        return (
          <>
            <circle cx="28" cy="40" r="4.2" fill="#242e28" />
            <circle cx="52" cy="40" r="4.2" fill="#242e28" />
            <circle cx="29.5" cy="38.5" r="1.5" fill="#ffffff" />
            <circle cx="53.5" cy="38.5" r="1.5" fill="#ffffff" />
            {/* Gentle zen smile */}
            <path d="M 34 50 Q 40 55 46 50" stroke="#242e28" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {/* Soft pink blush */}
            <circle cx="19" cy="45" r="4" fill="#f5cac3" opacity="0.8" />
            <circle cx="61" cy="45" r="4" fill="#f5cac3" opacity="0.8" />
          </>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`mascot-avatar-container ${isTalking ? 'talking-mascot' : 'floating-mascot'}`}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 12px rgba(49, 78, 62, 0.12))'
      }}
      title="Matcha Budge — Your Zen Focus Tea Spirit"
    >
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cute Tea Leaf Sprout on Head */}
        <path
          d="M 40 22 C 34 12, 28 15, 30 10 C 33 5, 45 10, 40 22 Z"
          fill="#588157"
          stroke="#344e41"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 40 22 C 46 13, 53 14, 52 9 C 48 5, 38 12, 40 22 Z"
          fill="#84a98c"
          stroke="#344e41"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Main Soft Rounded Body */}
        <path
          d="M 20 38 C 20 22, 60 22, 60 38 C 63 54, 58 66, 40 67 C 22 66, 17 54, 20 38 Z"
          fill="#a3b18a"
          stroke="#344e41"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Gentle Cream Belly */}
        <ellipse cx="40" cy="56" rx="13" ry="7" fill="#dad7cd" opacity="0.85" />

        {/* Dynamic Facial Features */}
        {renderEyesAndMouth()}
      </svg>
    </div>
  );
};
