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
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}
    onCompleteFocus();
  };

  return (
    <div className="hero-card" style={{ background: '#ffffff', border: '1px solid var(--border-dark)', borderRadius: '16px', padding: '1.2rem 1.1rem', boxShadow: 'var(--shadow-sm)' }}>
      {/* Header Intention Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-iris)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          🧭 Current Intention
        </span>
        {timer.extendedCount > 0 && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            +{timer.extendedCount * 5}m buffer
          </span>
        )}
      </div>

      {/* Task Title */}
      <h2 style={{ fontSize: '1.08rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.35 }}>
        {task.title}
      </h2>

      {/* Digits Display */}
      <div style={{ textAlign: 'center', margin: '0.4rem 0' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.8rem', fontWeight: 500, color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: 1 }}>
          {isSessionActive ? formatTime(timer.remainingSeconds) : '25:00'}
        </div>
      </div>

      {/* Hairline Progress Bar */}
      <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', margin: '0.65rem 0 1rem 0' }}>
        <div
          style={{
            height: '100%',
            width: isSessionActive ? `${progressPercentage}%` : '0%',
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            borderRadius: '5px',
            transition: 'width 0.4s ease'
          }}
        />
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
