import React from 'react';
import { AgentPersona } from '../../types';

interface PersonalitySelectorProps {
  currentPersona: AgentPersona;
  onSelect: (persona: AgentPersona) => void;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ currentPersona, onSelect }) => {
  const options: { id: AgentPersona; label: string; activeBg: string; activeColor: string }[] = [
    { id: 'gentle', label: '🌸 Serene Tea', activeBg: '#fcece9', activeColor: '#c87d55' },
    { id: 'direct', label: '⏱️ Mindful Coach', activeBg: '#f3ede2', activeColor: '#588157' },
    { id: 'spicy', label: '🌶️ Playful Spirit', activeBg: '#fae1d9', activeColor: '#c85a54' }
  ];

  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '0.1rem 0' }}>
      {options.map((opt) => {
        const isSelected = currentPersona === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className="nb-btn"
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.76rem',
              fontWeight: 600,
              background: isSelected ? opt.activeBg : '#fdfbf7',
              color: isSelected ? opt.activeColor : '#6b7c72',
              borderColor: isSelected ? opt.activeColor : 'var(--border-subtle)',
              boxShadow: isSelected ? '0 4px 12px rgba(49, 78, 62, 0.08)' : 'none',
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
