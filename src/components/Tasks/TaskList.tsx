import React from 'react';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { ListFilter } from 'lucide-react';

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
    <div className="task-list-section">
      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.2rem 0' }}>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            type="button"
            className="nb-btn"
            style={{
              padding: '0.25rem 0.55rem',
              fontSize: '0.74rem',
              background: filter === 'all' ? '#ffe600' : '#ffffff'
            }}
            onClick={() => onSetFilter('all')}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{
              padding: '0.25rem 0.55rem',
              fontSize: '0.74rem',
              background: filter === 'avoided' ? '#fca5a5' : '#ffffff'
            }}
            onClick={() => onSetFilter('avoided')}
          >
            🚨 Avoided ({avoidedCount})
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{
              padding: '0.25rem 0.55rem',
              fontSize: '0.74rem',
              background: filter === 'completed' ? '#86efac' : '#ffffff'
            }}
            onClick={() => onSetFilter('completed')}
          >
            ✅ Done ({completedCount})
          </button>
        </div>
      </div>

      {/* List items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#64748b', fontSize: '0.82rem', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '8px' }}>
            {filter === 'avoided'
              ? 'No avoided tasks! You are smoothly on track! 🎉'
              : filter === 'completed'
              ? 'No completed tasks yet. Finish a 25m sprint!'
              : 'Inbox is clean. Add a task below to start!'}
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
