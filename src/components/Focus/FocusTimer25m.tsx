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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    onComplete();
  };

  return (
    <div className="focus-timer-card" style={{ background: '#ffffff', border: '1.5px solid var(--border-dark)', borderRadius: '20px', padding: '1.15rem', boxShadow: '0 8px 24px rgba(49, 78, 62, 0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.4rem' }}>
        <span className="nb-badge" style={{ background: timer.status === 'running' ? '#e3ede5' : '#fceddd', color: timer.status === 'running' ? '#344e41' : '#b08968' }}>
          {timer.status === 'running' ? '⚡ 25M SPRINT ACTIVE' : timer.status === 'paused' ? '⏸️ SPRINT PAUSED' : '🎯 FOCUS READY'}
        </span>
        {timer.extendedCount > 0 && (
          <span className="nb-badge" style={{ background: '#efe9f4', color: '#6d597a' }}>
            +{timer.extendedCount * 5}m tea buffer
          </span>
        )}
      </div>

      {task && (
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6b7c72', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', margin: '0.2rem 0' }}>
          Focusing on: <strong style={{ color: 'var(--text-main)' }}>{task.title}</strong>
        </div>
      )}

      {/* Big Digits Display */}
      <div className="timer-countdown-text">
        {formatTime(timer.remainingSeconds)}
      </div>

      {/* Smooth Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: '#f0ece1', borderRadius: '8px', overflow: 'hidden', margin: '0.6rem 0 0.85rem 0' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercentage}%`,
            background: 'linear-gradient(90deg, #588157, #84a98c)',
            borderRadius: '8px',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
        {timer.status === 'running' ? (
          <button
            type="button"
            className="nb-btn"
            style={{ background: '#fdfbf7' }}
            onClick={onPause}
            title="Pause timer"
          >
            <Pause size={14} /> Pause
          </button>
        ) : (
          <button
            type="button"
            className="nb-btn nb-btn-success"
            onClick={onResume}
            title="Resume or start focus"
          >
            <Play size={14} /> Resume
          </button>
        )}

        <button
          type="button"
          className="nb-btn"
          onClick={onExtend}
          title="Add 5 more minutes (+5m)"
          style={{ background: '#fdfbf7' }}
        >
          <Plus size={13} /> 5m
        </button>

        <button
          type="button"
          className="nb-btn nb-btn-primary"
          onClick={handleTriggerComplete}
          title="Mark task as finished!"
        >
          <CheckCircle size={14} /> Complete
        </button>

        <button
          type="button"
          className="nb-btn nb-btn-danger"
          onClick={onGiveUp}
          title="Abandon session gently"
          style={{ padding: '0.45rem 0.6rem' }}
        >
          <XCircle size={14} />
        </button>
      </div>
    </div>
  );
};
