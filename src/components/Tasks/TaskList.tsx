import React from 'react';
import { Task } from '../../types';
import { Check, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask
}) => {
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.2rem' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Intentions ({activeTasks.length})
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {activeTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem', background: '#ffffff', border: '1px dashed var(--border-dark)', borderRadius: '12px' }}>
            Your space is clear. Enter an intention below.
          </div>
        ) : (
          activeTasks.map((task) => {
            const isSelected = task.id === activeTaskId;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                style={{
                  background: isSelected ? '#f8f9fc' : '#ffffff',
                  border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--shadow-main)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(task.id);
                  }}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    border: '1.2px solid #cbd5e1',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Check size={11} strokeWidth={2.5} color="transparent" />
                </button>

                <span style={{ flex: 1, fontSize: '0.84rem', fontWeight: isSelected ? 600 : 400, color: 'var(--text-main)' }}>
                  {task.title}
                </span>

                {task.estimatedMinutes && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {task.estimatedMinutes}m
                  </span>
                )}
              </div>
            );
          })
        )}

        {/* Completed Section (Discreet & Folded) */}
        {completedTasks.length > 0 && (
          <div style={{ marginTop: '0.5rem', opacity: 0.6 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', padding: '0 0.2rem' }}>
              Fulfilled ({completedTasks.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {completedTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: '#f8f9fa',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '0.45rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'line-through'
                  }}
                >
                  <Check size={13} color="#0d9488" strokeWidth={2.5} />
                  <span style={{ flex: 1 }}>{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
