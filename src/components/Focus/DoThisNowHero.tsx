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
      <div className="hero-card" style={{ background: '#f5efe6', textAlign: 'center', padding: '1.5rem 1rem', borderRadius: '18px', border: '1.5px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-matcha-dark)' }}>Zen Mind — Inbox Zero 🍵</h3>
        <p style={{ fontSize: '0.82rem', color: '#6b7c72' }}>
          All caught up! Take a calm breath, sip some tea, or capture a new task below.
        </p>
      </div>
    );
  }

  const isTimerRunningOnThisTask = timer.status === 'running' && timer.taskId === task.id;
  const isTimerPausedOnThisTask = timer.status === 'paused' && timer.taskId === task.id;

  const getUrgencyBadge = () => {
    switch (task.urgency) {
      case 'critical':
        return <span className="nb-badge" style={{ background: '#fae1d9', color: '#c85a54', borderColor: '#f2b5a7' }}><Flame size={12} /> Urgent</span>;
      case 'high':
        return <span className="nb-badge" style={{ background: '#fceed8', color: '#b08968', borderColor: '#e6ccb2' }}>🌿 High</span>;
      case 'medium':
        return <span className="nb-badge" style={{ background: '#e3ede5', color: '#344e41', borderColor: '#cad2c5' }}>🍵 Focus</span>;
      case 'low':
        return <span className="nb-badge" style={{ background: '#f5f2eb', color: '#7f8c8d', borderColor: '#e6e0d3' }}>🌱 Gentle</span>;
    }
  };

  const getEnergyBadge = () => {
    switch (task.energyLevel) {
      case 'low':
        return <span className="nb-badge" style={{ background: '#f7ece8', color: '#c87d55' }}><Moon size={11} /> Low Energy</span>;
      case 'medium':
        return <span className="nb-badge" style={{ background: '#f3ede2', color: '#588157' }}><Zap size={11} /> Balanced</span>;
      case 'high':
        return <span className="nb-badge" style={{ background: '#e3ede5', color: '#344e41' }}><Flame size={11} /> Deep Focus</span>;
    }
  };

  return (
    <div className="hero-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-matcha)', borderRadius: '20px', padding: '1.1rem', boxShadow: '0 8px 24px rgba(49, 78, 62, 0.08)' }}>
      <div className="hero-tag-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="nb-badge" style={{ background: 'var(--color-matcha-dark)', color: '#ffffff', border: 'none' }}>
            🎯 DO THIS NOW
          </span>
          {getUrgencyBadge()}
          {getEnergyBadge()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-matcha-dark)' }}>
          <Clock size={13} />
          <span>{task.estimatedMinutes}m</span>
        </div>
      </div>

      <h2
        className="hero-title"
        onClick={() => onOpenDetails(task.id)}
        title="Click to view details"
        style={{ cursor: 'pointer', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.3 }}
      >
        {task.title}
      </h2>

      {task.notes && (
        <p style={{ fontSize: '0.8rem', color: '#6b7c72', marginBottom: '0.65rem', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.notes}
        </p>
      )}

      {/* Micro-steps teaser if any */}
      {task.microSteps && task.microSteps.length > 0 && (
        <div style={{ background: '#f9f7f2', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.5rem 0.65rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-matcha-dark)', textTransform: 'uppercase', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CornerDownRight size={11} /> First Step:
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {task.microSteps[0].text}
          </div>
        </div>
      )}

      {/* Avoidance Alert Ribbon if avoided */}
      {task.snoozeCount >= 2 && (
        <div
          onClick={() => onOpenAvoidance(task.id)}
          style={{
            background: '#fcf0ed',
            border: '1.2px solid var(--color-terracotta)',
            borderRadius: '10px',
            padding: '0.4rem 0.6rem',
            marginBottom: '0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-terracotta)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <span>🚨 Snoozed {task.snoozeCount}x — Let's make it easy</span>
          <span style={{ textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '2px' }}>
            Break Down <ArrowRight size={11} />
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="hero-actions" style={{ display: 'flex', gap: '0.4rem' }}>
        {isTimerRunningOnThisTask ? (
          <button
            type="button"
            className="nb-btn nb-btn-success"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> In Focus...
          </button>
        ) : isTimerPausedOnThisTask ? (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> Resume Focus
          </button>
        ) : (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> Start 25m Focus
          </button>
        )}

        <button
          type="button"
          className="nb-btn"
          style={{ background: '#fdfbf7' }}
          onClick={() => onSnooze(task.id)}
          title="Snooze for later"
        >
          💤 Later
        </button>

        <button
          type="button"
          className="nb-btn"
          style={{ background: '#fdfbf7', padding: '0.45rem 0.65rem' }}
          onClick={() => onOpenDetails(task.id)}
          title="Open Task Details"
        >
          📝
        </button>
      </div>
    </div>
  );
};
