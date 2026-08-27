import React from 'react';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  filter: 'all' | 'avoided' | 'completed';
  onSetFilter: (filter: 'all' | 'avoided' | 'completed') => void;
  onSelectTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onSnooze: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  filter,
  onSetFilter,
  onSelectTask,
  onToggleComplete,
  onOpenDetails,
  onSnooze
}) => {
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'avoided') return (t.snoozeCount >= 2 || t.isAvoided) && t.status !== 'completed';
    return t.status !== 'completed';
  });

  const activeCount = tasks.filter(t => t.status !== 'completed').length;
  const avoidedCount = tasks.filter(t => (t.snoozeCount >= 2 || t.isAvoided) && t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="task-list-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            type="button"
            className="nb-btn"
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.74rem',
              background: filter === 'all' ? 'var(--color-matcha-dark)' : '#fdfbf7',
              color: filter === 'all' ? '#ffffff' : 'var(--text-main)',
              borderColor: filter === 'all' ? 'var(--color-matcha-dark)' : 'var(--border-subtle)'
            }}
            onClick={() => onSetFilter('all')}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.74rem',
              background: filter === 'avoided' ? '#fae1d9' : '#fdfbf7',
              color: filter === 'avoided' ? '#c85a54' : 'var(--text-main)',
              borderColor: filter === 'avoided' ? '#c85a54' : 'var(--border-subtle)'
            }}
            onClick={() => onSetFilter('avoided')}
          >
            🚨 Avoided ({avoidedCount})
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.74rem',
              background: filter === 'completed' ? '#e3ede5' : '#fdfbf7',
              color: filter === 'completed' ? '#344e41' : 'var(--text-main)',
              borderColor: filter === 'completed' ? '#588157' : 'var(--border-subtle)'
            }}
            onClick={() => onSetFilter('completed')}
          >
            ✅ Done ({completedCount})
          </button>
        </div>
      </div>

      {/* List items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.4rem 0.5rem', color: '#8c9c93', fontSize: '0.8rem', background: '#faf8f5', border: '1.2px dashed var(--border-subtle)', borderRadius: '14px' }}>
            {filter === 'avoided'
              ? 'No avoided tasks — your mind is clear and flowing! 🍵'
              : filter === 'completed'
              ? 'No completed tasks yet. Finish a 25m sprint!'
              : 'Your inbox is clear. Add a gentle task below.'}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={task.id === activeTaskId}
              onSelect={onSelectTask}
              onToggleComplete={onToggleComplete}
              onOpenDetails={onOpenDetails}
              onSnooze={onSnooze}
            />
          ))
        )}
      </div>
    </div>
  );
};
