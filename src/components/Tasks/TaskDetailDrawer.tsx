import React, { useState } from 'react';
import { Task, EnergyLevel, UrgencyLevel, MicroStep } from '../../types';
import { X, Trash2, Plus, Check, Play, Flame, Moon, Zap, Sparkles } from 'lucide-react';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (id: string) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onStartFocus
}) => {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState(task.estimatedMinutes);
  const [urgency, setUrgency] = useState<UrgencyLevel>(task.urgency);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(task.energyLevel);
  const [microSteps, setMicroSteps] = useState<MicroStep[]>(task.microSteps || []);
  const [newStepText, setNewStepText] = useState('');

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title: title.trim() || 'Untitled Task',
      notes: notes.trim(),
      estimatedMinutes,
      urgency,
      energyLevel,
      microSteps
    });
    onClose();
  };

  const handleToggleMicroStep = (stepId: string) => {
    setMicroSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleAddMicroStep = () => {
    if (!newStepText.trim()) return;
    const newStep: MicroStep = {
      id: `ms-${Date.now()}`,
      text: newStepText.trim(),
      completed: false,
      estimatedMinutes: 2
    };
    setMicroSteps(prev => [...prev, newStep]);
    setNewStepText('');
  };

  const handleDeleteMicroStep = (stepId: string) => {
    setMicroSteps(prev => prev.filter(s => s.id !== stepId));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#ffffff',
            border: '2px solid #121826',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <span className="nb-badge" style={{ background: '#ffe600' }}>Task Detail</span>
          {task.snoozeCount > 0 && (
            <span className="nb-badge" style={{ background: '#fca5a5' }}>
              💤 Snoozed {task.snoozeCount}x
            </span>
          )}
        </div>

        {/* Title Input */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Task Title
          </label>
          <input
            type="text"
            className="quick-capture-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Urgency & Energy Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
              style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1.5px solid #121826', fontWeight: 600, fontSize: '0.8rem' }}
            >
              <option value="low">🌱 Low</option>
              <option value="medium">⚡ Medium</option>
              <option value="high">🔥 High</option>
              <option value="critical">🚨 Critical</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              Energy Level
            </label>
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
              style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1.5px solid #121826', fontWeight: 600, fontSize: '0.8rem' }}
            >
              <option value="low">🪫 Low (Zombie)</option>
              <option value="medium">⚡ Medium (Normal)</option>
              <option value="high">🚀 High (Beast Mode)</option>
            </select>
          </div>
        </div>

        {/* Estimated Duration */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.2rem' }}>
            Estimated Minutes: {estimatedMinutes}m
          </label>
          <input
            type="range"
            min="5"
            max="90"
            step="5"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '0.85rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Notes / Context
          </label>
          <textarea
            rows={3}
            className="quick-capture-input"
            placeholder="Add quick notes or links..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Micro-Steps Breakdown Section */}
        <div style={{ background: '#f8fafc', border: '1.8px solid #121826', borderRadius: '8px', padding: '0.65rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Sparkles size={12} color="#eab308" /> 2-Minute Micro-Steps ({microSteps.filter(s => s.completed).length}/{microSteps.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.5rem' }}>
            {microSteps.map((step) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.4rem',
                  background: '#ffffff',
                  border: '1.2px solid #121826',
                  borderRadius: '5px',
                  fontSize: '0.8rem'
                }}
              >
                <div
                  onClick={() => handleToggleMicroStep(step.id)}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1.2px solid #121826',
                    background: step.completed ? '#86efac' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {step.completed && <Check size={11} strokeWidth={3} />}
                </div>

                <span style={{ flex: 1, textDecoration: step.completed ? 'line-through' : 'none', color: step.completed ? '#94a3b8' : '#1e293b' }}>
                  {step.text}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteMicroStep(step.id)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Step Input */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <input
              type="text"
              placeholder="Add micro step..."
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMicroStep()}
              style={{
                flex: 1,
                padding: '0.3rem 0.5rem',
                fontSize: '0.78rem',
                border: '1.2px solid #121826',
                borderRadius: '5px',
                outline: 'none'
              }}
            />
            <button
              type="button"
              className="nb-btn"
              onClick={handleAddMicroStep}
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1.5 }}
            onClick={handleSave}
          >
            Save Changes
          </button>

          <button
            type="button"
            className="nb-btn nb-btn-success"
            onClick={() => {
              handleSave();
              onStartFocus(task.id);
            }}
            title="Save and Launch 25m Focus"
          >
            <Play size={14} /> Focus
          </button>

          <button
            type="button"
            className="nb-btn nb-btn-danger"
            onClick={() => {
              if (confirm('Delete this task?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            title="Delete task"
            style={{ padding: '0.5rem 0.6rem' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
