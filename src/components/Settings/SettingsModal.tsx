import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { X, RotateCcw, Volume2, VolumeX, Mic, Key, Clock } from 'lucide-react';

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
      <div className="modal-content" style={{ maxHeight: '88vh', overflowY: 'auto', padding: '1.5rem', background: '#ffffff', borderRadius: '18px', border: '1px solid var(--border-dark)', boxShadow: 'var(--shadow-lg)' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'color 0.15s ease'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <span style={{ fontSize: '0.68rem', background: '#eef2ff', color: '#4f46e5', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 600 }}>
            Preferences
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Sanctuary Settings</h3>
        </div>

        {/* Focus Duration Selector */}
        <div style={{ marginBottom: '1.1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            <Clock size={12} color="#6366f1" /> Default Flow Duration
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.4rem' }}>
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                className="nb-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.45rem 0.2rem',
                  background: (settings.focusDurationMinutes || 25) === mins ? '#eef2ff' : '#ffffff',
                  color: (settings.focusDurationMinutes || 25) === mins ? '#4f46e5' : 'var(--text-main)',
                  borderColor: (settings.focusDurationMinutes || 25) === mins ? '#818cf8' : 'var(--border-dark)',
                  fontWeight: (settings.focusDurationMinutes || 25) === mins ? 600 : 400
                }}
                onClick={() => onUpdateSettings({ focusDurationMinutes: mins })}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Voice Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '0.6rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>
              {settings.soundEnabled ? <Volume2 size={15} color="#6366f1" /> : <VolumeX size={15} color="#94a3b8" />}
              <span>Gentle Chimes & Sounds</span>
            </div>
            <button
              type="button"
              className="nb-btn"
              style={{
                padding: '0.2rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: settings.soundEnabled ? '#eef2ff' : '#ffffff',
                color: settings.soundEnabled ? '#4f46e5' : 'var(--text-muted)',
                borderColor: settings.soundEnabled ? '#818cf8' : 'var(--border-dark)'
              }}
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '0.6rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>
              <Mic size={15} color="#6366f1" />
              <span>Voice Speech (Calm TTS Guide)</span>
            </div>
            <button
              type="button"
              className="nb-btn"
              style={{
                padding: '0.2rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: settings.voiceEnabled ? '#eef2ff' : '#ffffff',
                color: settings.voiceEnabled ? '#4f46e5' : 'var(--text-muted)',
                borderColor: settings.voiceEnabled ? '#818cf8' : 'var(--border-dark)'
              }}
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
            >
              {settings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key */}
        <div style={{ marginBottom: '1.2rem', background: '#f8f9fc', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.75rem 0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            <Key size={13} color="#6366f1" />
            <span>Optional AI Key (Google Gemini)</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
            Runs 100% locally with zero latency by default. Paste a key only if you wish to connect live Gemini models.
          </p>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, padding: '0.38rem 0.65rem', fontSize: '0.76rem', borderRadius: '8px', border: '1px solid var(--border-dark)', background: '#ffffff', outline: 'none' }}
            />
            <button
              type="button"
              className="nb-btn"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem' }}
              onClick={() => onUpdateSettings({ geminiApiKey: apiKey.trim() })}
            >
              Save
            </button>
          </div>
        </div>

        {/* Reset / Actions */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="nb-btn"
            style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: '#ffffff' }}
            onClick={() => {
              if (confirm('Clear and reset intentions to fresh sanctuary state?')) {
                onResetAllData();
                onClose();
              }
            }}
          >
            <RotateCcw size={12} /> Reset Intentions
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
