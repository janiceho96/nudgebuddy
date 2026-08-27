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
      case 'critical': return '#fca5a5';
      case 'high': return '#fed7aa';
      case 'medium': return '#fef08a';
      case 'low': return '#e2e8f0';
    }
  };

  const getEnergyIcon = () => {
    switch (task.energyLevel) {
      case 'low': return <Moon size={11} color="#9333ea" />;
      case 'medium': return <Zap size={11} color="#d97706" />;
      case 'high': return <Flame size={11} color="#16a34a" />;
    }
  };

  return (
    <div
      className={`task-card ${isSelected ? 'active-selected' : ''} ${isAvoided && !isCompleted ? 'avoided-card' : ''} ${isCompleted ? 'is-completed' : ''}`}
      onClick={() => onSelect(task.id)}
    >
      {/* Checkbox button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id);
        }}
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          border: '2px solid #121826',
          background: isCompleted ? '#86efac' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        {isCompleted && <Check size={14} strokeWidth={3.5} color="#121826" />}
      </button>

      {/* Task Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.86rem',
              color: isCompleted ? '#64748b' : '#0f172a',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}
          >
            {task.title}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.72rem' }}>
          <span className="nb-badge" style={{ background: getUrgencyColor(), padding: '0.1rem 0.35rem' }}>
            {task.urgency}
          </span>

          <span className="nb-badge" style={{ background: '#f8fafc', padding: '0.1rem 0.35rem' }}>
            {getEnergyIcon()} {task.estimatedMinutes}m
          </span>

          {task.tags.map((tag) => (
            <span key={tag} className="nb-badge" style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', color: '#475569' }}>
              #{tag}
            </span>
          ))}

          {task.snoozeCount > 0 && !isCompleted && (
            <span className="nb-badge" style={{ background: isAvoided ? '#fca5a5' : '#fed7aa', padding: '0.1rem 0.35rem' }}>
              💤 {task.snoozeCount}x
            </span>
          )}

          {task.microSteps && task.microSteps.length > 0 && !isCompleted && (
            <span className="nb-badge" style={{ background: '#e0e7ff', padding: '0.1rem 0.35rem' }}>
              🧩 {task.microSteps.filter(s => s.completed).length}/{task.microSteps.length}
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        {!isCompleted && (
          <button
            type="button"
            className="nb-btn"
            style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem' }}
            onClick={() => onSnooze(task.id)}
            title="Snooze"
          >
            💤
          </button>
        )}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem' }}
          onClick={() => onOpenDetails(task.id)}
          title="Details"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};
