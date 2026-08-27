import React from 'react';
import { AgentPersona } from '../../types';

interface PersonalitySelectorProps {
  currentPersona: AgentPersona;
  onSelect: (persona: AgentPersona) => void;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ currentPersona, onSelect }) => {
  const options: { id: AgentPersona; label: string; bg: string }[] = [
    { id: 'gentle', label: '🌸 Gentle', bg: '#fbcfe8' },
    { id: 'direct', label: '⏱️ Coach', bg: '#fed7aa' },
    { id: 'spicy', label: '🌶️ Spicy', bg: '#fca5a5' }
  ];

  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '0.2rem 0' }}>
      {options.map((opt) => {
        const isSelected = currentPersona === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className="nb-btn"
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.78rem',
              background: isSelected ? opt.bg : '#ffffff',
              borderColor: '#121826',
              boxShadow: isSelected ? '3px 3px 0px #121826' : '1.5px 1.5px 0px #121826',
              transform: isSelected ? 'scale(1.03)' : 'none'
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
