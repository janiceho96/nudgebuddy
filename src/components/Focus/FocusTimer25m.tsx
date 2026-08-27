import React from 'react';
import { FocusSession, Task } from '../../types';
import { Play, Pause, Plus, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusTimer25mProps {
  timer: FocusSession;
  task: Task | null;
  onPause: () => void;
  onResume: () => void;
  onExtend: () => void;
  onComplete: () => void;
  onGiveUp: () => void;
}

export const FocusTimer25m: React.FC<FocusTimer25mProps> = ({
  timer,
  task,
  onPause,
  onResume,
  onExtend,
  onComplete,
  onGiveUp
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = timer.totalDurationSeconds > 0
    ? Math.min(100, Math.max(0, ((timer.totalDurationSeconds - timer.remainingSeconds) / timer.totalDurationSeconds) * 100))
    : 0;

  const handleTriggerComplete = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    onComplete();
  };

  return (
    <div className="focus-timer-card" style={{ background: '#ffffff', border: '1px solid var(--border-dark)', borderRadius: '16px', padding: '1.15rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.35rem' }}>
        <span className="nb-badge" style={{ background: timer.status === 'running' ? '#eef2ff' : '#f8f9fa', color: timer.status === 'running' ? '#4f46e5' : '#64748b' }}>
          {timer.status === 'running' ? '✨ DEEP FLOW ACTIVE' : timer.status === 'paused' ? '⏸️ FLOW PAUSED' : '🎯 FLOW READY'}
        </span>
        {timer.extendedCount > 0 && (
          <span className="nb-badge" style={{ background: '#fdf2f8', color: '#db2777' }}>
            +{timer.extendedCount * 5}m space
          </span>
        )}
      </div>

      {task && (
        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', margin: '0.15rem 0' }}>
          Intention: <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{task.title}</strong>
        </div>
      )}

      {/* Digits Display */}
      <div className="timer-countdown-text">
        {formatTime(timer.remainingSeconds)}
      </div>

      {/* Minimal Hairline Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', margin: '0.5rem 0 0.85rem 0' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercentage}%`,
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            borderRadius: '6px',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
        {timer.status === 'running' ? (
          <button
            type="button"
            className="nb-btn"
            style={{ background: '#f8fafc' }}
            onClick={onPause}
            title="Pause flow"
          >
            <Pause size={14} /> Pause
          </button>
        ) : (
          <button
            type="button"
            className="nb-btn nb-btn-success"
            onClick={onResume}
            title="Resume flow"
          >
            <Play size={14} /> Resume
          </button>
        )}

        <button
          type="button"
          className="nb-btn"
          onClick={onExtend}
          title="Add 5 more minutes (+5m)"
          style={{ background: '#f8fafc' }}
        >
          <Plus size={13} /> 5m
        </button>

        <button
          type="button"
          className="nb-btn nb-btn-primary"
          onClick={handleTriggerComplete}
          title="Complete intention"
        >
          <CheckCircle size={14} /> Fulfilled
        </button>

        <button
          type="button"
          className="nb-btn nb-btn-danger"
          onClick={onGiveUp}
          title="Release session mindfully"
          style={{ padding: '0.45rem 0.55rem' }}
        >
          <XCircle size={14} />
        </button>
      </div>
    </div>
  );
};
