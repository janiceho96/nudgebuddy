import React, { useState } from 'react';
import { EnergyLevel, UrgencyLevel } from '../../types';
import { Plus, Sparkles } from 'lucide-react';

interface QuickCaptureInputProps {
  onAddTask: (task: {
    title: string;
    estimatedMinutes?: number;
    tags?: string[];
    urgency?: UrgencyLevel;
    energyLevel?: EnergyLevel;
    notes?: string;
  }) => void;
}

export const QuickCaptureInput: React.FC<QuickCaptureInputProps> = ({ onAddTask }) => {
  const [inputVal, setInputVal] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    let text = inputVal.trim();
    let estimatedMinutes = 25;
    const tags: string[] = [];
    let urgency: UrgencyLevel = 'medium';

    // Parse time syntax e.g. 15m, 30m, 45m, 10min
    const timeMatch = text.match(/\b(\d+)\s*(m|min|mins)\b/i);
    if (timeMatch) {
      estimatedMinutes = parseInt(timeMatch[1], 10);
      text = text.replace(timeMatch[0], '').trim();
    }

    // Parse #tags
    const tagMatches = text.match(/#([\w-]+)/g);
    if (tagMatches) {
      tagMatches.forEach(t => {
        tags.push(t.replace('#', ''));
        text = text.replace(t, '').trim();
      });
    }

    // Parse !urgency e.g. !crit, !high, !med, !low
    if (text.includes('!crit') || text.includes('!critical')) {
      urgency = 'critical';
      text = text.replace(/!crit(ical)?/i, '').trim();
    } else if (text.includes('!high')) {
      urgency = 'high';
      text = text.replace(/!high/i, '').trim();
    } else if (text.includes('!low')) {
      urgency = 'low';
      text = text.replace(/!low/i, '').trim();
    } else if (text.includes('!med')) {
      urgency = 'medium';
      text = text.replace(/!med(ium)?/i, '').trim();
    }

    // Clean up multiple spaces
    text = text.replace(/\s+/g, ' ').trim();

    onAddTask({
      title: text || 'Untitled Task',
      estimatedMinutes,
      tags,
      urgency,
      energyLevel
    });

    setInputVal('');
  };

  return (
    <div className="quick-capture-wrap">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <input
            type="text"
            className="quick-capture-input"
            placeholder="Quick capture: 'Write memo 15m #work !high'..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button
            type="submit"
            className="nb-btn nb-btn-primary"
            style={{ padding: '0.5rem 0.8rem', flexShrink: 0 }}
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Sparkles size={11} color="#eab308" />
            <span>Shortcuts: <strong>15m</strong>, <strong>#tag</strong>, <strong>!high</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span>Energy:</span>
            <button
              type="button"
              onClick={() => setEnergyLevel('low')}
              style={{
                background: energyLevel === 'low' ? '#fbcfe8' : '#ffffff',
                border: '1px solid #121826',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}
            >
              🪫
            </button>
            <button
              type="button"
              onClick={() => setEnergyLevel('medium')}
              style={{
                background: energyLevel === 'medium' ? '#fed7aa' : '#ffffff',
                border: '1px solid #121826',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}
            >
              ⚡
            </button>
            <button
              type="button"
              onClick={() => setEnergyLevel('high')}
              style={{
                background: energyLevel === 'high' ? '#86efac' : '#ffffff',
                border: '1px solid #121826',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}
            >
              🚀
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
