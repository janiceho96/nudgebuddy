import React from 'react';
import { Task, FocusSession } from '../../types';
import { Play, Clock, Flame, Moon, Zap, ArrowRight, CornerDownRight } from 'lucide-react';

interface DoThisNowHeroProps {
  task: Task | null;
  timer: FocusSession;
  onStartFocus: (taskId: string) => void;
  onSnooze: (taskId: string) => void;
  onOpenDetails: (taskId: string) => void;
  onOpenAvoidance: (taskId: string) => void;
}

export const DoThisNowHero: React.FC<DoThisNowHeroProps> = ({
  task,
  timer,
  onStartFocus,
  onSnooze,
  onOpenDetails,
  onOpenAvoidance
}) => {
  if (!task) {
    return (
      <div className="hero-card" style={{ background: '#e2e8f0', textAlign: 'center', padding: '1.5rem 1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Inbox Zero! 🥳</h3>
        <p style={{ fontSize: '0.85rem', color: '#475569' }}>
          All caught up! Add a new task below or take a well-deserved guilt-free break.
        </p>
      </div>
    );
  }

  const isTimerRunningOnThisTask = timer.status === 'running' && timer.taskId === task.id;
  const isTimerPausedOnThisTask = timer.status === 'paused' && timer.taskId === task.id;

  const getUrgencyBadge = () => {
    switch (task.urgency) {
      case 'critical':
        return <span className="nb-badge" style={{ background: '#fca5a5' }}><Flame size={12} /> Critical</span>;
      case 'high':
        return <span className="nb-badge" style={{ background: '#fed7aa' }}>🔥 High</span>;
      case 'medium':
        return <span className="nb-badge" style={{ background: '#fef08a' }}>⚡ Medium</span>;
      case 'low':
        return <span className="nb-badge" style={{ background: '#e2e8f0' }}>🌱 Low</span>;
    }
  };

  const getEnergyBadge = () => {
    switch (task.energyLevel) {
      case 'low':
        return <span className="nb-badge" style={{ background: '#fbcfe8' }}><Moon size={11} /> Zombie Mode</span>;
      case 'medium':
        return <span className="nb-badge" style={{ background: '#fed7aa' }}><Zap size={11} /> Normal</span>;
      case 'high':
        return <span className="nb-badge" style={{ background: '#86efac' }}><Flame size={11} /> Beast Mode</span>;
    }
  };

  return (
    <div className="hero-card">
      <div className="hero-tag-bar">
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="nb-badge" style={{ background: '#121826', color: '#ffe600', borderColor: '#121826' }}>
            🎯 DO THIS NOW
          </span>
          {getUrgencyBadge()}
          {getEnergyBadge()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 700 }}>
          <Clock size={13} />
          <span>{task.estimatedMinutes}m</span>
        </div>
      </div>

      <h2
        className="hero-title"
        onClick={() => onOpenDetails(task.id)}
        title="Click to view details"
        style={{ cursor: 'pointer' }}
      >
        {task.title}
      </h2>

      {task.notes && (
        <p style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '0.6rem', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.notes}
        </p>
      )}

      {/* Micro-steps teaser if any */}
      {task.microSteps && task.microSteps.length > 0 && (
        <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1.5px solid #121826', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.6rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CornerDownRight size={12} /> First Micro-Step:
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
            {task.microSteps[0].text}
          </div>
        </div>
      )}

      {/* Avoidance Alert Ribbon if avoided */}
      {task.snoozeCount >= 2 && (
        <div
          onClick={() => onOpenAvoidance(task.id)}
          style={{
            background: '#fee2e2',
            border: '1.8px solid #ef4444',
            borderRadius: '6px',
            padding: '0.35rem 0.5rem',
            marginBottom: '0.6rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#b91c1c',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <span>🚨 Snoozed {task.snoozeCount}x — High Resistance!</span>
          <span style={{ textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '2px' }}>
            Break Down <ArrowRight size={11} />
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="hero-actions">
        {isTimerRunningOnThisTask ? (
          <button
            type="button"
            className="nb-btn nb-btn-success"
            style={{ flex: 1.5, background: '#86efac' }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={15} /> In Focus...
          </button>
        ) : isTimerPausedOnThisTask ? (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={15} /> Resume Focus
          </button>
        ) : (
          <button
            type="button"
            className="nb-btn"
            style={{ flex: 1.5, background: '#121826', color: '#ffe600' }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={15} fill="#ffe600" /> Start 25m Focus
          </button>
        )}

        <button
          type="button"
          className="nb-btn"
          style={{ background: '#ffffff' }}
          onClick={() => onSnooze(task.id)}
          title="Snooze for later"
        >
          💤 Snooze
        </button>

        <button
          type="button"
          className="nb-btn"
          style={{ background: '#ffffff', padding: '0.5rem 0.65rem' }}
          onClick={() => onOpenDetails(task.id)}
          title="Open Task Details"
        >
          📝
        </button>
      </div>
    </div>
  );
};
