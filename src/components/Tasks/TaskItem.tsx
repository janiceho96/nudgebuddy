import React from 'react';
import { Task } from '../../types';
import { Check, Clock, Flame, Zap, Moon } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onSnooze: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  onSelect,
  onToggleComplete,
  onOpenDetails,
  onSnooze
}) => {
  const isCompleted = task.status === 'completed';
  const isAvoided = task.snoozeCount >= 2 || task.isAvoided;

  const getUrgencyColor = () => {
    switch (task.urgency) {
      case 'critical': return '#fae1d9';
      case 'high': return '#fceed8';
      case 'medium': return '#e3ede5';
      case 'low': return '#f5f2eb';
    }
  };

  const getEnergyIcon = () => {
    switch (task.energyLevel) {
      case 'low': return <Moon size={11} color="#c87d55" />;
      case 'medium': return <Zap size={11} color="#588157" />;
      case 'high': return <Flame size={11} color="#344e41" />;
    }
  };

  return (
    <div
      className={`task-item-card ${isSelected ? 'is-active-focus' : ''} ${isAvoided && !isCompleted ? 'is-avoided' : ''}`}
      onClick={() => onSelect(task.id)}
      style={{
        background: isCompleted ? '#faf8f5' : isSelected ? '#fdfbf7' : '#ffffff',
        opacity: isCompleted ? 0.65 : 1,
        border: isSelected ? '1.5px solid var(--color-matcha)' : '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '0.65rem 0.85rem',
        boxShadow: isSelected ? '0 4px 16px rgba(88, 129, 87, 0.12)' : '0 2px 8px rgba(49, 78, 62, 0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Checkbox button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id);
        }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '6px',
          border: isCompleted ? '1.5px solid var(--color-matcha)' : '1.5px solid var(--border-dark)',
          background: isCompleted ? 'var(--color-matcha)' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        {isCompleted && <Check size={13} strokeWidth={3} color="#ffffff" />}
      </button>

      {/* Task Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: '0.84rem',
              color: isCompleted ? '#8c9c93' : 'var(--text-main)',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}
          >
            {task.title}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.7rem' }}>
          <span className="nb-badge" style={{ background: getUrgencyColor(), padding: '0.1rem 0.4rem' }}>
            {task.urgency}
          </span>

          <span className="nb-badge" style={{ background: '#f5f2eb', padding: '0.1rem 0.4rem' }}>
            {getEnergyIcon()} {task.estimatedMinutes}m
          </span>

          {task.tags.map((tag) => (
            <span key={tag} className="nb-badge" style={{ background: '#f3ede2', padding: '0.1rem 0.4rem', color: '#6b7c72' }}>
              #{tag}
            </span>
          ))}

          {task.snoozeCount > 0 && !isCompleted && (
            <span className="nb-badge" style={{ background: isAvoided ? '#fae1d9' : '#fceed8', color: isAvoided ? '#c85a54' : '#b08968', padding: '0.1rem 0.4rem' }}>
              💤 {task.snoozeCount}x
            </span>
          )}

          {task.microSteps && task.microSteps.length > 0 && !isCompleted && (
            <span className="nb-badge" style={{ background: '#e3ede5', color: '#344e41', padding: '0.1rem 0.4rem' }}>
              🧩 {task.microSteps.filter(s => s.completed).length}/{task.microSteps.length}
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        {!isCompleted && (
          <button
            type="button"
            className="nb-btn"
            style={{ padding: '0.2rem 0.35rem', fontSize: '0.7rem', background: '#fdfbf7', border: '1px solid var(--border-subtle)' }}
            onClick={() => onSnooze(task.id)}
            title="Snooze"
          >
            💤
          </button>
        )}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.2rem 0.35rem', fontSize: '0.7rem', background: '#fdfbf7', border: '1px solid var(--border-subtle)' }}
          onClick={() => onOpenDetails(task.id)}
          title="Details"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};
