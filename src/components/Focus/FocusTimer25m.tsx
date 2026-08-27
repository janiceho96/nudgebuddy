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
    } catch {
      // Fallback
    }
    onComplete();
  };

  return (
    <div className="timer-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <span className="nb-badge" style={{ background: timer.status === 'running' ? '#86efac' : '#fed7aa' }}>
          {timer.status === 'running' ? '⚡ 25M SPRINT ACTIVE' : timer.status === 'paused' ? '⏸️ SPRINT PAUSED' : '🎯 FOCUS READY'}
        </span>
        {timer.extendedCount > 0 && (
          <span className="nb-badge" style={{ background: '#d8b4fe' }}>
            +{timer.extendedCount * 5}m bonus
          </span>
        )}
      </div>

      {task && (
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Focusing on: <strong style={{ color: '#0f172a' }}>{task.title}</strong>
        </div>
      )}

      {/* Big Digits Display */}
      <div className="timer-digits">
        {formatTime(timer.remainingSeconds)}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {timer.status === 'running' ? (
          <button
            type="button"
            className="nb-btn nb-btn-lavender"
            onClick={onPause}
            title="Pause timer"
          >
            <Pause size={15} /> Pause
          </button>
        ) : (
          <button
            type="button"
            className="nb-btn nb-btn-success"
            onClick={onResume}
            title="Resume or start focus"
          >
            <Play size={15} /> Resume
          </button>
        )}

        <button
          type="button"
          className="nb-btn"
          onClick={onExtend}
          title="Add 5 more minutes (+5m)"
          style={{ background: '#fed7aa' }}
        >
          <Plus size={14} /> 5m
        </button>

        <button
          type="button"
          className="nb-btn nb-btn-success"
          onClick={handleTriggerComplete}
          title="Mark task as finished!"
        >
          <CheckCircle size={15} /> Done!
        </button>

        <button
          type="button"
          className="nb-btn nb-btn-danger"
          onClick={onGiveUp}
          title="Abandon session without shame"
          style={{ padding: '0.5rem 0.6rem' }}
        >
          <XCircle size={15} />
        </button>
      </div>
    </div>
  );
};
