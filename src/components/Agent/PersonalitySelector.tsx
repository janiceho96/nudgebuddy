import React from 'react';
import { AgentPersona } from '../../types';

interface PersonalitySelectorProps {
  currentPersona: AgentPersona;
  onSelect: (persona: AgentPersona) => void;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ currentPersona, onSelect }) => {
  const options: { id: AgentPersona; label: string; activeBg: string; activeColor: string }[] = [
    { id: 'gentle', label: '🕊️ Sanctuary', activeBg: '#eef2ff', activeColor: '#4f46e5' },
    { id: 'direct', label: '🧭 Mindful Sage', activeBg: '#f0fdfa', activeColor: '#0d9488' },
    { id: 'spicy', label: '✨ Intuitive Beacon', activeBg: '#fdf2f8', activeColor: '#db2777' }
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
