import React from 'react';
import { Task, FocusSession } from '../../types';
import { Play, Pause, Plus, CheckCircle, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoThisNowHeroProps {
  task: Task | null;
  timer: FocusSession;
  onStartFocus: (taskId: string) => void;
  onPauseFocus: () => void;
  onResumeFocus: () => void;
  onExtendFocus: () => void;
  onCompleteFocus: () => void;
}

export const DoThisNowHero: React.FC<DoThisNowHeroProps> = ({
  task,
  timer,
  onStartFocus,
  onPauseFocus,
  onResumeFocus,
  onExtendFocus,
  onCompleteFocus
}) => {
  if (!task) {
    return (
      <div
        className="hero-card"
        style={{
          background: '#ffffff',
          textAlign: 'center',
          padding: '1.6rem 1.1rem',
          borderRadius: '20px',
          border: '1.5px solid var(--border-dark)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🌱🕊️</div>
        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.25rem', color: '#1b4332' }}>
          Peaceful Sanctuary
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          No active intention yet. Choose or add a task below to grow your garden!
        </p>
      </div>
    );
  }

  const isRunning = timer.status === 'running';
  const isPaused = timer.status === 'paused';
  const isSessionActive = isRunning || isPaused;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = timer.totalDurationSeconds > 0
    ? Math.min(100, Math.max(0, ((timer.totalDurationSeconds - timer.remainingSeconds) / timer.totalDurationSeconds) * 100))
    : 0;

  const handleComplete = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#52b788', '#f472b6', '#fde047', '#74c69d']
      });
    } catch {}
    onCompleteFocus();
  };

  const getPlantStage = (pct: number) => {
    if (!isSessionActive) return { icon: '🌱', label: 'Seedling ready to bloom', badgeBg: '#eaf5ee', color: '#2d6a4f' };
    if (pct < 25) return { icon: '🌰', label: 'Little Seed Planted', badgeBg: '#fef3c7', color: '#92400e' };
    if (pct < 50) return { icon: '🌱', label: 'Baby Sprout Emerging', badgeBg: '#eaf5ee', color: '#2d6a4f' };
    if (pct < 75) return { icon: '🌿', label: 'Flourishing Green Leaves', badgeBg: '#d8f3dc', color: '#1b4332' };
    if (pct < 95) return { icon: '🌷', label: 'Flower Bud Opening', badgeBg: '#fce7f3', color: '#9d174d' };
    return { icon: '🌸', label: 'Full Sakura Blossom!', badgeBg: '#fce7f3', color: '#be185d' };
  };

  const plantStage = getPlantStage(progressPercentage);

  return (
    <div
      className="hero-card cute-timer-frame"
      style={{
        background: '#ffffff',
        border: '1.5px solid #d8f3dc',
        borderRadius: '22px',
        padding: '1.15rem 1.1rem 1rem 1.1rem',
        boxShadow: '0 8px 24px -8px rgba(45, 106, 79, 0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Cute Corner Botanical Vines & Blossom Accents */}
      <div style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '0.85rem', opacity: 0.8, pointerEvents: 'none', userSelect: 'none' }}>
        🌿
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '0.85rem', opacity: 0.85, pointerEvents: 'none', userSelect: 'none' }}>
        {isRunning ? '✨' : '🌸'}
      </div>

      {/* Header Intention Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2d6a4f', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🍃</span> Focus Sanctuary
        </span>
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: plantStage.color,
            background: plantStage.badgeBg,
            padding: '0.18rem 0.55rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{plantStage.icon}</span>
          <span>{plantStage.label}</span>
        </span>
      </div>

      {/* Task Title */}
      <h2
        style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#143622',
          marginBottom: '0.65rem',
          lineHeight: 1.35,
          textAlign: 'center',
          padding: '0 0.4rem'
        }}
      >
        {task.title}
      </h2>

      {/* Cozy Pillowy Digits Frame with Soft Garden Meadow Background */}
      <div
        className={`cute-digits-capsule ${isRunning ? 'is-flow-active' : ''}`}
        style={{
          background: isRunning ? 'linear-gradient(180deg, #f2faf4 0%, #e5f5ea 100%)' : 'linear-gradient(180deg, #f8fbf9 0%, #edf6f0 100%)',
          border: isRunning ? '1.5px solid #95d5b2' : '1.5px solid #d8f3dc',
          borderRadius: '18px',
          padding: '0.6rem 0.8rem 0.5rem 0.8rem',
          textAlign: 'center',
          position: 'relative',
          margin: '0.2rem 0 0.75rem 0',
          boxShadow: isRunning ? '0 4px 14px rgba(82, 183, 136, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)' : 'inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
      >
        {/* Adorable Mini Butterfly/Sprout Fluttering on Side */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '0.85rem',
            animation: isRunning ? 'gentleFlutter 2s ease-in-out infinite' : 'none'
          }}
        >
          {isRunning ? '🦋' : '🌱'}
        </div>

        {/* Large Digits */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '3rem',
            fontWeight: 800,
            color: isRunning ? '#1b4332' : '#2d6a4f',
            letterSpacing: '-1.5px',
            lineHeight: 1,
            textShadow: '0 2px 4px rgba(45, 106, 79, 0.08)'
          }}
        >
          {isSessionActive ? formatTime(timer.remainingSeconds) : '25:00'}
        </div>

        {/* Cute Progress Bar with Sprout Stage */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#ffffff',
            borderRadius: '8px',
            overflow: 'visible',
            margin: '0.55rem 0 0.2rem 0',
            border: '1px solid #d8f3dc',
            position: 'relative'
          }}
        >
          <div
            style={{
              height: '100%',
              width: isSessionActive ? `${progressPercentage}%` : '0%',
              background: 'linear-gradient(90deg, #52b788 0%, #74c69d 60%, #f472b6 100%)',
              borderRadius: '8px',
              transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative'
            }}
          >
            {isSessionActive && (
              <span
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '-9px',
                  fontSize: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
                  animation: 'sproutWiggle 1.5s ease-in-out infinite',
                  display: 'inline-block'
                }}
              >
                {plantStage.icon}
              </span>
            )}
          </div>
        </div>

        {/* Tiny Garden Bottom Meadow Accent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', padding: '0 0.2rem', fontSize: '0.68rem', color: '#52b788', fontWeight: 600 }}>
          <span>🌰 Seed</span>
          <span style={{ fontSize: '0.62rem', color: '#74c69d' }}>• • •</span>
          <span>🌿 Grow</span>
          <span style={{ fontSize: '0.62rem', color: '#74c69d' }}>• • •</span>
          <span>🌸 Bloom</span>
        </div>
      </div>

      {/* Pillowy Cute Controls */}
      <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center' }}>
        {!isSessionActive ? (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{
              flex: 1,
              padding: '0.65rem 0',
              borderRadius: '14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: 'linear-gradient(180deg, #2d6a4f 0%, #1b4332 100%)',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)'
            }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={15} /> <span>Begin Flow 🌸</span>
          </button>
        ) : isRunning ? (
          <>
            <button
              type="button"
              className="nb-btn"
              style={{
                flex: 1,
                padding: '0.55rem 0',
                borderRadius: '14px',
                background: '#ffffff',
                border: '1.5px solid #d8f3dc',
                color: '#2d6a4f',
                fontWeight: 700,
                fontSize: '0.82rem'
              }}
              onClick={onPauseFocus}
            >
              <Pause size={14} /> <span>Pause</span>
            </button>
            <button
              type="button"
              className="nb-btn"
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '14px',
                background: '#fef3c7',
                border: '1.5px solid #fde68a',
                color: '#92400e',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
              onClick={onExtendFocus}
              title="Add gentle 5m breather buffer"
            >
              <Plus size={14} /> <span>+5m</span>
            </button>
            <button
              type="button"
              className="nb-btn"
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #52b788 0%, #40916c 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                boxShadow: '0 4px 10px rgba(82, 183, 136, 0.3)'
              }}
              onClick={handleComplete}
            >
              <CheckCircle size={14} /> <span>Bloom! 🌸</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="nb-btn nb-btn-primary"
              style={{
                flex: 1,
                padding: '0.55rem 0',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #2d6a4f 0%, #1b4332 100%)'
              }}
              onClick={onResumeFocus}
            >
              <Play size={14} /> <span>Resume Flow</span>
            </button>
            <button
              type="button"
              className="nb-btn"
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #52b788 0%, #40916c 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700
              }}
              onClick={handleComplete}
            >
              <CheckCircle size={14} /> <span>Bloom! 🌸</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
