import React, { useState } from 'react';
import { AgentMood } from '../../types';

interface MascotAvatarProps {
  mood: AgentMood;
  size?: number;
  isTalking?: boolean;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({ mood, size = 48, isTalking = false, onClick }) => {
  const [sparkles, setSparkles] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);

  const handleAvatarClick = () => {
    // Generate adorable floating hearts & petals on poke
    const icons = ['🌸', '✨', '🌱', '💖', '🍃', '⭐'];
    const newSparkle = {
      id: Date.now() + Math.random(),
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: (Math.random() - 0.5) * 36,
      y: -20 - Math.random() * 20
    };

    setSparkles(prev => [...prev.slice(-4), newSparkle]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 900);

    if (onClick) onClick();
  };

  const renderKawaiiEyes = () => {
    switch (mood) {
      case 'hyped':
      case 'celebrating':
        return (
          <>
            {/* Joyful crescent happy eyes */}
            <path d="M 27 41 Q 34 31 41 41" stroke="#143622" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 47 41 Q 54 31 61 41" stroke="#143622" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Happy open smile */}
            <path d="M 40 48 Q 44 54 48 48" stroke="#143622" strokeWidth="2" fill="#ffb4a2" strokeLinecap="round" />
          </>
        );

      case 'worried':
        return (
          <>
            {/* Big pleading anime eyes */}
            <circle cx="34" cy="40" r="4.5" fill="#143622" />
            <circle cx="54" cy="40" r="4.5" fill="#143622" />
            <circle cx="32.5" cy="38" r="1.8" fill="#ffffff" />
            <circle cx="52.5" cy="38" r="1.8" fill="#ffffff" />
            <circle cx="35.5" cy="42" r="1" fill="#ffffff" />
            <circle cx="55.5" cy="42" r="1" fill="#ffffff" />
            <path d="M 41 50 Q 44 47 47 50" stroke="#143622" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );

      case 'sleeping':
        return (
          <>
            {/* Peaceful closed eyes */}
            <path d="M 28 42 Q 34 46 40 42" stroke="#40916c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M 48 42 Q 54 46 60 42" stroke="#40916c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M 42 49 Q 44 51 46 49" stroke="#40916c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        );

      case 'watching':
      case 'idle':
      default:
        return (
          <>
            {/* Big sparkly kawaii anime eyes with dual specular shines */}
            <circle cx="34" cy="41" r="4.2" fill="#143622" />
            <circle cx="54" cy="41" r="4.2" fill="#143622" />
            {/* Primary sparkle */}
            <circle cx="32.5" cy="39" r="1.8" fill="#ffffff" />
            <circle cx="52.5" cy="39" r="1.8" fill="#ffffff" />
            {/* Secondary cute mini sparkle */}
            <circle cx="35.5" cy="42.5" r="0.9" fill="#ffffff" />
            <circle cx="55.5" cy="42.5" r="0.9" fill="#ffffff" />
            {/* Sweet gentle cat-like smile */}
            <path d="M 40 48 Q 44 52 48 48" stroke="#143622" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <div
      onClick={handleAvatarClick}
      className={`mascot-avatar-container ${isTalking ? 'talking-mascot' : 'ethereal-spirit'}`}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none'
      }}
      title="Sprout — Your Cute Mindful Forest Companion (Tap me for love!)"
    >
      {/* Floating Click Hearts / Petals */}
      {sparkles.map(s => (
        <span
          key={s.id}
          className="mascot-sparkle-float"
          style={{
            position: 'absolute',
            fontSize: '1rem',
            pointerEvents: 'none',
            left: `calc(50% + ${s.x}px)`,
            top: `${s.y}px`,
            zIndex: 99
          }}
        >
          {s.icon}
        </span>
      ))}

      <svg
        viewBox="0 0 88 88"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(82, 183, 136, 0.25))' }}
      >
        <defs>
          <radialGradient id="forestCuteAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8f3dc" stopOpacity="1" />
            <stop offset="65%" stopColor="#b7e4c7" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#95d5b2" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="cuteCore" x1="0" y1="0" x2="88" y2="88">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f2fbf5" />
          </linearGradient>
        </defs>

        {/* Soft Luminous Cloud Aura */}
        <circle cx="44" cy="46" r="37" fill="url(#forestCuteAura)" />

        {/* Cute Head Sprout with Wiggle Animation */}
        <g className="cute-head-sprout">
          {/* Left Leaf */}
          <path
            d="M 44 24 C 40 13 29 12 28 17 C 27 22 36 24 44 24 Z"
            fill="#40916c"
            stroke="#2d6a4f"
            strokeWidth="1"
          />
          {/* Right Leaf */}
          <path
            d="M 44 24 C 48 12 59 11 60 16 C 61 21 52 24 44 24 Z"
            fill="#52b788"
            stroke="#2d6a4f"
            strokeWidth="1"
          />
          {/* Tiny Blossom Bud */}
          <circle cx="44" cy="18" r="2.5" fill="#f472b6" />
          <line x1="44" y1="24" x2="44" y2="28" stroke="#2d6a4f" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Marshmallow Round Body */}
        <circle
          cx="44"
          cy="46"
          r="26"
          fill="url(#cuteCore)"
          stroke="#95d5b2"
          strokeWidth="2"
        />

        {/* Soft Glowing Peach Blush Cheeks */}
        <circle cx="29" cy="49" r="4.2" fill="#ffb4a2" opacity="0.85" />
        <circle cx="59" cy="49" r="4.2" fill="#ffb4a2" opacity="0.85" />
        {/* Tiny highlight on blush */}
        <circle cx="28" cy="48" r="1.2" fill="#ffffff" opacity="0.9" />
        <circle cx="58" cy="48" r="1.2" fill="#ffffff" opacity="0.9" />

        {/* Facial Expression */}
        {renderKawaiiEyes()}
      </svg>
    </div>
  );
};
