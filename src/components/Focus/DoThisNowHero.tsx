import React from 'react';
import { Task, FocusSession } from '../../types';
import { Play, Pause, Plus, CheckCircle } from 'lucide-react';
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
      <div className="hero-card" style={{ background: '#ffffff', textAlign: 'center', padding: '1.5rem 1rem', borderRadius: '16px', border: '1px solid var(--border-dark)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Clear Mind 🕊️</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          No active intention. Type a task below to center your focus.
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
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}
    onCompleteFocus();
  };

  const getPlantStage = (pct: number) => {
    if (!isSessionActive) return { icon: '🌱', label: 'Sprout Ready to Grow' };
    if (pct < 25) return { icon: '🌰', label: 'Little Seed Planted' };
    if (pct < 50) return { icon: '🌱', label: 'Baby Sprout Emerging' };
    if (pct < 75) return { icon: '🌿', label: 'Flourishing Green Leaves' };
    if (pct < 95) return { icon: '🌷', label: 'Flower Bud Opening' };
    return { icon: '🌸', label: 'Sakura Blossom in Full Bloom!' };
  };

  const plantStage = getPlantStage(progressPercentage);

  return (
    <div className="hero-card" style={{ background: '#ffffff', border: '1px solid var(--border-dark)', borderRadius: '18px', padding: '1.2rem 1.1rem', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
      {/* Header Intention Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2d6a4f', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🌿</span> Forest Focus Intention
        </span>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#40916c', background: '#eaf5ee', padding: '0.15rem 0.45rem', borderRadius: '10px' }}>
          {plantStage.icon} {plantStage.label}
        </span>
      </div>

      {/* Task Title */}
      <h2 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem', lineHeight: 1.35 }}>
        {task.title}
      </h2>

      {/* Digits Display */}
      <div style={{ textAlign: 'center', margin: '0.2rem 0' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.9rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: 1 }}>
          {isSessionActive ? formatTime(timer.remainingSeconds) : '25:00'}
        </div>
      </div>

      {/* Hairline Progress Bar with Cute Sprout Floating Head */}
      <div style={{ width: '100%', height: '7px', background: '#eaf3ed', borderRadius: '7px', overflow: 'visible', margin: '0.75rem 0 1.1rem 0', position: 'relative' }}>
        <div
          style={{
            height: '100%',
            width: isSessionActive ? `${progressPercentage}%` : '0%',
            background: 'linear-gradient(90deg, #40916c, #52b788, #74c69d)',
            borderRadius: '7px',
            transition: 'width 0.4s ease',
            position: 'relative'
          }}
        >
          {isSessionActive && progressPercentage > 5 && (
            <span
              style={{
                position: 'absolute',
                right: '-8px',
                top: '-9px',
                fontSize: '0.9rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                transform: 'scale(1.1)'
              }}
            >
              {plantStage.icon}
            </span>
          )}
        </div>
      </div>

      {/* Clean Minimal Controls */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
        {!isSessionActive ? (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1, padding: '0.55rem 0' }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> Begin Flow
          </button>
        ) : isRunning ? (
          <>
            <button
              type="button"
              className="nb-btn"
              style={{ flex: 1, padding: '0.5rem 0' }}
              onClick={onPauseFocus}
            >
              <Pause size={14} /> Pause
            </button>
            <button
              type="button"
              className="nb-btn"
              style={{ padding: '0.5rem 0.75rem' }}
              onClick={onExtendFocus}
              title="Add 5 minutes"
            >
              <Plus size={13} /> 5m
            </button>
            <button
              type="button"
              className="nb-btn nb-btn-success"
              style={{ flex: 1, padding: '0.5rem 0' }}
              onClick={handleComplete}
            >
              <CheckCircle size={14} /> Done
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="nb-btn nb-btn-primary"
              style={{ flex: 1, padding: '0.5rem 0' }}
              onClick={onResumeFocus}
            >
              <Play size={14} /> Resume
            </button>
            <button
              type="button"
              className="nb-btn nb-btn-success"
              style={{ flex: 1, padding: '0.5rem 0' }}
              onClick={handleComplete}
            >
              <CheckCircle size={14} /> Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};
