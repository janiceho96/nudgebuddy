import React from 'react';
import { AgentPersona } from '../../types';

interface PersonalitySelectorProps {
  currentPersona: AgentPersona;
  onSelect: (persona: AgentPersona) => void;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ currentPersona, onSelect }) => {
  const options: { id: AgentPersona; label: string; activeBg: string; activeColor: string }[] = [
    { id: 'gentle', label: '🌿 Gentle Sprout', activeBg: '#d8f3dc', activeColor: '#1b4332' },
    { id: 'direct', label: '🌲 Ancient Oak', activeBg: '#eaf3ed', activeColor: '#2d6a4f' },
    { id: 'spicy', label: '🌸 Wild Flora', activeBg: '#fefae0', activeColor: '#b08968' }
  ];

  return (
    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', margin: '0.1rem 0' }}>
      {options.map((opt) => {
        const isSelected = currentPersona === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className="nb-btn"
            style={{
              padding: '0.28rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 500,
              background: isSelected ? opt.activeBg : '#ffffff',
              color: isSelected ? opt.activeColor : 'var(--text-secondary)',
              borderColor: isSelected ? opt.activeColor : 'var(--border-dark)',
              boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.08)' : 'none',
              transform: isSelected ? 'translateY(-1px)' : 'none'
            }}
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
