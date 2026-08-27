import React, { useState } from 'react';
import { AppSettings, AgentPersona, ProactivityLevel } from '../../types';
import { X, RotateCcw, Volume2, VolumeX, Mic, Key, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
  onResetAllData
}) => {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.9rem' }}>
          <span className="nb-badge" style={{ background: '#d8b4fe' }}>Settings</span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Accountability Preferences</h3>
        </div>

        {/* Agent Persona */}
        <div style={{ marginBottom: '0.9rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Agent Persona / Tone
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
            {(['gentle', 'direct', 'spicy'] as AgentPersona[]).map((p) => (
              <button
                key={p}
                type="button"
                className="nb-btn"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.2rem',
                  background: settings.defaultPersona === p ? '#ffe600' : '#ffffff'
                }}
                onClick={() => onUpdateSettings({ defaultPersona: p })}
              >
                {p === 'gentle' ? '🌸 Gentle' : p === 'direct' ? '⏱️ Direct' : '🌶️ Spicy'}
              </button>
            ))}
          </div>
        </div>

        {/* Proactivity Level */}
        <div style={{ marginBottom: '0.9rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Proactivity & Nudge Aggressiveness
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
            {(['low', 'balanced', 'high'] as ProactivityLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                className="nb-btn"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.2rem',
                  background: settings.proactivity === lvl ? '#86efac' : '#ffffff'
                }}
                onClick={() => onUpdateSettings({ proactivity: lvl })}
              >
                {lvl === 'low' ? 'Chill' : lvl === 'balanced' ? 'Balanced' : 'High Alert'}
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Voice Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1.5px solid #121826' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              {settings.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>8-Bit Retro Sound Effects</span>
            </div>
            <button
              type="button"
              className="nb-btn"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', background: settings.soundEnabled ? '#86efac' : '#e2e8f0' }}
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1.5px solid #121826' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <Mic size={15} />
              <span>Voice Speech (TTS Voice)</span>
            </div>
            <button
              type="button"
              className="nb-btn"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', background: settings.voiceEnabled ? '#86efac' : '#e2e8f0' }}
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
            >
              {settings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key */}
        <div style={{ marginBottom: '1.1rem', background: '#fffbeb', border: '1.5px solid #121826', borderRadius: '8px', padding: '0.7rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            <Key size={13} color="#d97706" />
            <span>Optional Gemini API Key (Live LLM streaming)</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.45rem' }}>
            Leave blank to use the built-in intelligent zero-latency local brain, or paste a key to connect live Gemini models.
          </p>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', border: '1.5px solid #121826' }}
            />
            <button
              type="button"
              className="nb-btn"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.74rem' }}
              onClick={() => onUpdateSettings({ geminiApiKey: apiKey.trim() })}
            >
              Save Key
            </button>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="nb-btn nb-btn-danger"
            style={{ fontSize: '0.74rem' }}
            onClick={() => {
              if (confirm('Reset all tasks and state to fresh initial demo?')) {
                onResetAllData();
                onClose();
              }
            }}
          >
            <RotateCcw size={13} /> Reset Demo Data
          </button>

          <button
            type="button"
            className="nb-btn nb-btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
