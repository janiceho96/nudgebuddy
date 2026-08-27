import React from 'react';
import { AgentMood } from '../../types';

interface MascotAvatarProps {
  mood: AgentMood;
  size?: number;
  isTalking?: boolean;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({ mood, size = 64, isTalking = false, onClick }) => {
  // Render dynamic SVG facial features based on mood
  const renderEyesAndMouth = () => {
    if (isTalking) {
      return (
        <>
          <circle cx="28" cy="38" r="5.5" fill="#121826" />
          <circle cx="52" cy="38" r="5.5" fill="#121826" />
          <circle cx="29" cy="36.5" r="2" fill="#ffffff" />
          <circle cx="53" cy="36.5" r="2" fill="#ffffff" />
          {/* Animated talking open mouth */}
          <ellipse cx="40" cy="52" rx="7" ry="5" fill="#121826" className="animate-talking-mouth" />
          <ellipse cx="40" cy="54" rx="4" ry="2.5" fill="#fda4af" />
        </>
      );
    }

    switch (mood) {
      case 'watching':
        return (
          <>
            {/* Concentrated focused eyes with pupil darts */}
            <circle cx="28" cy="38" r="5.5" fill="#121826" />
            <circle cx="52" cy="38" r="5.5" fill="#121826" />
            <circle cx="29" cy="36.5" r="2" fill="#ffffff" />
            <circle cx="53" cy="36.5" r="2" fill="#ffffff" />
            {/* Direct concentrated flat mouth */}
            <line x1="33" y1="52" x2="47" y2="52" stroke="#121826" strokeWidth="3" strokeLinecap="round" />
            {/* Eyebrows angled inward */}
            <line x1="22" y1="30" x2="33" y2="33" stroke="#121826" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="30" x2="47" y2="33" stroke="#121826" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'hyped':
        return (
          <>
            {/* Star sparkle / big excited eyes */}
            <circle cx="27" cy="36" r="6" fill="#121826" />
            <circle cx="53" cy="36" r="6" fill="#121826" />
            <circle cx="29" cy="34" r="2.5" fill="#ffe600" />
            <circle cx="55" cy="34" r="2.5" fill="#ffe600" />
            {/* Big grin */}
            <path d="M 28 48 Q 40 60 52 48" fill="#121826" />
            <path d="M 33 51 Q 40 57 47 51" fill="#fda4af" />
          </>
        );

      case 'judging':
        return (
          <>
            {/* Side-eye look */}
            <ellipse cx="27" cy="38" rx="6" ry="3.5" fill="#121826" />
            <ellipse cx="53" cy="38" rx="6" ry="3.5" fill="#121826" />
            <circle cx="24" cy="38" r="2.5" fill="#ffffff" />
            <circle cx="50" cy="38" r="2.5" fill="#ffffff" />
            {/* Smug / cynical slanted mouth */}
            <path d="M 32 53 Q 42 50 49 55" stroke="#121826" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Raised single eyebrow */}
            <path d="M 21 28 Q 28 25 34 31" stroke="#121826" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line x1="47" y1="32" x2="58" y2="32" stroke="#121826" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'worried':
        return (
          <>
            {/* Wide teary empathetic eyes */}
            <circle cx="27" cy="37" r="6.5" fill="#121826" />
            <circle cx="53" cy="37" r="6.5" fill="#121826" />
            <circle cx="25" cy="35" r="2.5" fill="#ffffff" />
            <circle cx="51" cy="35" r="2.5" fill="#ffffff" />
            {/* Worried inverted arc mouth */}
            <path d="M 32 54 Q 40 47 48 54" stroke="#121826" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Worried eyebrows angled outward */}
            <line x1="22" y1="32" x2="33" y2="28" stroke="#121826" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="32" x2="47" y2="28" stroke="#121826" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'celebrating':
        return (
          <>
            {/* Happy closed curve eyes */}
            <path d="M 22 38 Q 28 30 34 38" stroke="#121826" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 46 38 Q 52 30 58 38" stroke="#121826" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Wide joyful mouth */}
            <path d="M 28 46 Q 40 62 52 46 Z" fill="#121826" />
            <path d="M 33 50 Q 40 59 47 50" fill="#fda4af" />
            {/* Party sparkles on side */}
            <text x="60" y="24" fontSize="14">✨</text>
            <text x="4" y="26" fontSize="14">🎉</text>
          </>
        );

      case 'sleeping':
        return (
          <>
            {/* Flat sleeping lines */}
            <line x1="22" y1="38" x2="33" y2="38" stroke="#121826" strokeWidth="3" strokeLinecap="round" />
            <line x1="47" y1="38" x2="58" y2="38" stroke="#121826" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="40" cy="51" rx="3" ry="2" fill="#121826" />
            <text x="56" y="22" fontSize="12" fontWeight="bold" fill="#64748b">Zzz</text>
          </>
        );

      case 'idle':
      default:
        return (
          <>
            {/* Neutral friendly eyes */}
            <circle cx="28" cy="38" r="5" fill="#121826" />
            <circle cx="52" cy="38" r="5" fill="#121826" />
            <circle cx="30" cy="36" r="1.8" fill="#ffffff" />
            <circle cx="54" cy="36" r="1.8" fill="#ffffff" />
            {/* Cute gentle smile */}
            <path d="M 33 49 Q 40 56 47 49" stroke="#121826" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Rosy cheeks */}
            <circle cx="20" cy="44" r="3.5" fill="#fda4af" opacity="0.8" />
            <circle cx="60" cy="44" r="3.5" fill="#fda4af" opacity="0.8" />
          </>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`mascot-avatar-container ${mood === 'hyped' ? 'animate-wiggle' : isTalking ? 'animate-talking-mascot' : 'animate-bounce-subtle'}`}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        flexShrink: 0,
        filter: 'drop-shadow(2px 2px 0px #121826)'
      }}
      title="Budge the Accountability Gremlin (Click to chat or banter!)"
    >
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antennas / Goblin Ears */}
        <path d="M 16 28 L 8 16 L 24 22 Z" fill="#86efac" stroke="#121826" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 64 28 L 72 16 L 56 22 Z" fill="#86efac" stroke="#121826" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Main Head/Body Blob */}
        <path
          d="M 18 36 C 18 20, 62 20, 62 36 C 65 52, 60 66, 40 67 C 20 66, 15 52, 18 36 Z"
          fill="#86efac"
          stroke="#121826"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Little Belly Pattern */}
        <ellipse cx="40" cy="58" rx="14" ry="7" fill="#bbf7d0" />

        {/* Dynamic Facial Features */}
        {renderEyesAndMouth()}
      </svg>
    </div>
  );
};
