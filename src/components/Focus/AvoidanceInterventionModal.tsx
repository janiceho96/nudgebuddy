import React, { useState } from 'react';
import { Task, MicroStep } from '../../types';
import { MascotAvatar } from '../Agent/MascotAvatar';
import { generateMicroStepsForTask } from '../../core/avoidanceDetector';
import { Play, Check, X, Sparkles, Plus } from 'lucide-react';

interface AvoidanceInterventionModalProps {
  task: Task | null;
  onClose: () => void;
  onApplySteps: (taskId: string, steps: MicroStep[]) => void;
  onStartStepFocus: (taskId: string) => void;
}

export const AvoidanceInterventionModal: React.FC<AvoidanceInterventionModalProps> = ({
  task,
  onClose,
  onApplySteps,
  onStartStepFocus
}) => {
  if (!task) return null;

  const [steps, setSteps] = useState<MicroStep[]>(() => {
    if (task.microSteps && task.microSteps.length > 0) {
      return task.microSteps;
    }
    return generateMicroStepsForTask(task);
  });

  const [customStepText, setCustomStepText] = useState('');

  const handleToggleStep = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleAddCustomStep = () => {
    if (!customStepText.trim()) return;
    const newStep: MicroStep = {
      id: `ms-${Date.now()}`,
      text: customStepText.trim(),
      completed: false,
      estimatedMinutes: 2
    };
    setSteps(prev => [...prev, newStep]);
    setCustomStepText('');
  };

  const handleStartNow = () => {
    onApplySteps(task.id, steps);
    onStartStepFocus(task.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ background: '#fffbeb' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <MascotAvatar mood="worried" size={54} />
          <div>
            <div className="nb-badge" style={{ background: '#fca5a5', marginBottom: '0.2rem' }}>
              🚨 Avoidance Intervention
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
              Feeling Stuck on This?
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.9rem', lineHeight: 1.4 }}>
          Executive dysfunction makes tasks look like mountains. Let's make it impossibly easy by committing to <strong>just the first 2-minute step</strong>!
        </p>

        <div style={{ background: '#ffffff', border: '2px solid #121826', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} color="#eab308" /> 2-Minute Micro-Steps:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {steps.map((step, idx) => (
              <div
                key={step.id}
                onClick={() => handleToggleStep(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.5rem',
                  background: step.completed ? '#f1f5f9' : '#fefce8',
                  border: '1.5px solid #121826',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: step.completed ? 'line-through' : 'none'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: '1.5px solid #121826',
                    background: step.completed ? '#86efac' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {step.completed && <Check size={12} strokeWidth={3} />}
                </div>
                <span style={{ flex: 1 }}>{idx + 1}. {step.text}</span>
              </div>
            ))}
          </div>

          {/* Quick add extra step */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
            <input
              type="text"
              placeholder="Add your own tiny step..."
              value={customStepText}
              onChange={(e) => setCustomStepText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomStep()}
              style={{
                flex: 1,
                padding: '0.35rem 0.6rem',
                fontSize: '0.78rem',
                border: '1.5px solid #121826',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
            <button
              type="button"
              className="nb-btn"
              onClick={handleAddCustomStep}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
            >
              <Plus size={13} /> Add
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            type="button"
            className="nb-btn nb-btn-success"
            style={{ flex: 1, padding: '0.65rem' }}
            onClick={handleStartNow}
          >
            <Play size={15} fill="#121826" /> Start Step 1 (25m Timer)
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{ background: '#ffffff' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
