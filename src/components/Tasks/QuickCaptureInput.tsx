import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface QuickCaptureInputProps {
  onAddTask: (task: {
    title: string;
    estimatedMinutes?: number;
  }) => void;
}

export const QuickCaptureInput: React.FC<QuickCaptureInputProps> = ({ onAddTask }) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    let text = inputVal.trim();
    let estimatedMinutes = 25;

    const timeMatch = text.match(/\b(\d+)\s*(m|min|mins)\b/i);
    if (timeMatch) {
      estimatedMinutes = parseInt(timeMatch[1], 10);
      text = text.replace(timeMatch[0], '').trim();
    }

    onAddTask({
      title: text || 'Untitled Intention',
      estimatedMinutes
    });

    setInputVal('');
  };

  return (
    <div className="quick-capture-wrap" style={{ background: '#ffffff', borderTop: '1px solid var(--border-subtle)', padding: '0.65rem 1rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <input
          type="text"
          className="quick-capture-input"
          placeholder="Type an intention (e.g. 'Draft spec 25m')..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{
            flex: 1,
            padding: '0.55rem 0.85rem',
            border: '1px solid var(--border-dark)',
            borderRadius: '10px',
            fontSize: '0.82rem',
            background: '#f8f9fa',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          className="nb-btn nb-btn-primary"
          style={{ padding: '0.5rem 0.75rem', borderRadius: '10px' }}
          title="Add Intention"
        >
          <Plus size={15} />
        </button>
      </form>
    </div>
  );
};
