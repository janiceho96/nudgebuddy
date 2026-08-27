import React from 'react';
import { Task, FocusSession } from '../../types';
import { Play, Clock, Sparkles, Moon, Zap, ArrowRight, CornerDownRight } from 'lucide-react';

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
      <div className="hero-card" style={{ background: '#f8f9fa', textAlign: 'center', padding: '1.4rem 1rem', borderRadius: '16px', border: '1px solid var(--border-dark)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>Mindful Space — Clear Horizon 🕊️</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          All intentions fulfilled for now. Take a deep breath or add a thoughtful task below.
        </p>
      </div>
    );
  }

  const isTimerRunningOnThisTask = timer.status === 'running' && timer.taskId === task.id;
  const isTimerPausedOnThisTask = timer.status === 'paused' && timer.taskId === task.id;

  const getUrgencyBadge = () => {
    switch (task.urgency) {
      case 'critical':
        return <span className="nb-badge" style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#fecaca' }}>Essential</span>;
      case 'high':
        return <span className="nb-badge" style={{ background: '#fffbeb', color: '#d97706', borderColor: '#fde68a' }}>Priority</span>;
      case 'medium':
        return <span className="nb-badge" style={{ background: '#f0fdfa', color: '#0d9488', borderColor: '#ccfbf1' }}>Meaningful</span>;
      case 'low':
        return <span className="nb-badge" style={{ background: '#f8f9fa', color: '#64748b', borderColor: '#e2e8f0' }}>Gentle</span>;
    }
  };

  const getEnergyBadge = () => {
    switch (task.energyLevel) {
      case 'low':
        return <span className="nb-badge" style={{ background: '#fdf2f8', color: '#db2777' }}><Moon size={11} /> Low Drain</span>;
      case 'medium':
        return <span className="nb-badge" style={{ background: '#f1f5f9', color: '#475569' }}><Zap size={11} /> Balanced</span>;
      case 'high':
        return <span className="nb-badge" style={{ background: '#eef2ff', color: '#4f46e5' }}><Sparkles size={11} /> Deep Flow</span>;
    }
  };

  return (
    <div className="hero-card" style={{ background: '#ffffff', border: '1px solid var(--border-dark)', borderRadius: '16px', padding: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="nb-badge" style={{ background: 'var(--color-primary)', color: '#ffffff', border: 'none', fontWeight: 600 }}>
            🧭 NORTH STAR
          </span>
          {getUrgencyBadge()}
          {getEnergyBadge()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <Clock size={12} />
          <span>{task.estimatedMinutes}m</span>
        </div>
      </div>

      <h2
        className="hero-title"
        onClick={() => onOpenDetails(task.id)}
        title="Click to view details"
        style={{ cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.35 }}
      >
        {task.title}
      </h2>

      {task.notes && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.notes}
        </p>
      )}

      {/* Micro-steps teaser if any */}
      {task.microSteps && task.microSteps.length > 0 && (
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.45rem 0.6rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-iris)', textTransform: 'uppercase', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CornerDownRight size={11} /> First Step:
          </div>
          <div style={{ fontSize: '0.76rem', fontWeight: 500, color: 'var(--text-main)' }}>
            {task.microSteps[0].text}
          </div>
        </div>
      )}

      {/* Friction / Avoidance Alert */}
      {task.snoozeCount >= 2 && (
        <div
          onClick={() => onOpenAvoidance(task.id)}
          style={{
            background: '#fdf2f8',
            border: '1px solid #fbcfe8',
            borderRadius: '8px',
            padding: '0.35rem 0.6rem',
            marginBottom: '0.75rem',
            fontSize: '0.74rem',
            fontWeight: 500,
            color: '#db2777',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <span>🌱 Resistance noticed — Let's make it lighter</span>
          <span style={{ textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '2px' }}>
            Break Down <ArrowRight size={11} />
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="hero-actions" style={{ display: 'flex', gap: '0.35rem' }}>
        {isTimerRunningOnThisTask ? (
          <button
            type="button"
            className="nb-btn nb-btn-success"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> In Flow...
          </button>
        ) : isTimerPausedOnThisTask ? (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> Resume Flow
          </button>
        ) : (
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1.5 }}
            onClick={() => onStartFocus(task.id)}
          >
            <Play size={14} /> Begin 25m Flow
          </button>
        )}

        <button
          type="button"
          className="nb-btn"
          style={{ background: '#ffffff' }}
          onClick={() => onSnooze(task.id)}
          title="Postpone mindfully"
        >
          Later
        </button>

        <button
          type="button"
          className="nb-btn"
          style={{ background: '#ffffff', padding: '0.45rem 0.65rem' }}
          onClick={() => onOpenDetails(task.id)}
          title="Open Details"
        >
          📝
        </button>
      </div>
    </div>
  );
};
