import React from 'react';
import { EnergyLevel, HoverHideMode } from '../../types';
import { Settings, Sparkles, Eye, Minimize2, Pin, Brain, Trophy, FolderSync } from 'lucide-react';

interface MacOSHeaderProps {
  isWideMode: boolean;
  onToggleWideMode: () => void;
  userEnergy: EnergyLevel;
  onSetEnergy: (energy: EnergyLevel) => void;
  hoverHideMode: HoverHideMode;
  onCycleHoverHideMode: () => void;
  onOpenBrainDump: () => void;
  onOpenDailyRecap: () => void;
  onOpenSync: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
}

export const MacOSHeader: React.FC<MacOSHeaderProps> = ({
  isWideMode,
  onToggleWideMode,
  userEnergy,
  onSetEnergy,
  hoverHideMode,
  onCycleHoverHideMode,
  onOpenBrainDump,
  onOpenDailyRecap,
  onOpenSync,
  onOpenSettings,
  onReset
}) => {
  const getHoverModeLabel = () => {
    switch (hoverHideMode) {
      case 'bottom_dock':
        return { label: 'Bottom Dock', icon: <Minimize2 size={13} />, bg: '#e3ede5', title: '🚀 Bottom Dock: Floats as a bottom pill and expands UPWARD when hovered' };
      case 'edge_drawer':
        return { label: 'Edge Drawer', icon: <Minimize2 size={13} />, bg: '#f3ede2', title: '🪄 Edge Slide-out: Slides into the right bezel of your Mac' };
      case 'peek_dock':
        return { label: 'Peek Dock', icon: <Minimize2 size={13} />, bg: '#fceddd', title: 'Hover-to-Reveal: Collapses to mini pill when cursor leaves' };
      case 'ghost_dim':
        return { label: 'Ghost Dim', icon: <Eye size={13} />, bg: '#efe9f4', title: 'Hover-to-Reveal: Dims translucent when cursor leaves' };
      case 'none':
      default:
        return { label: 'Pinned Open', icon: <Pin size={13} />, bg: '#ffffff', title: '📌 Pinned Open: Always fully visible' };
    }
  };

  const modeInfo = getHoverModeLabel();

  return (
    <header className="macos-header" style={{ background: '#ffffff', borderBottom: '1.5px solid var(--border-subtle)', padding: '0.65rem 0.9rem' }}>
      <div className="traffic-lights">
        <div
          className="dot dot-red"
          title="Reset to Demo State"
          onClick={() => {
            if (confirm('Reset all tasks to initial demo state?')) {
              onReset();
            }
          }}
        />
        <div
          className="dot dot-yellow"
          title="Toggle Compact View"
          onClick={onToggleWideMode}
        />
        <div
          className="dot dot-green"
          title="Toggle Wide Two-Column View"
          onClick={onToggleWideMode}
        />
      </div>

      <div className="header-title-badge">
        <Sparkles size={14} color="#6366f1" fill="#6366f1" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 600 }}>NudgeBuddy</span>
        <span style={{ fontSize: '0.65rem', background: '#eef2ff', color: '#4f46e5', padding: '0.1rem 0.45rem', borderRadius: '12px', fontWeight: 500 }}>
          Sanctuary
        </span>
      </div>

      <div className="header-controls">
        {/* Brain Dump Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.22rem 0.4rem', fontSize: '0.72rem', background: '#fdfbf7' }}
          onClick={onOpenBrainDump}
          title="🧠 Open Brain Dump AI Parser"
        >
          <Brain size={13} color="#588157" />
        </button>

        {/* Daily Recap Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.22rem 0.4rem', fontSize: '0.72rem', background: '#fdfbf7' }}
          onClick={onOpenDailyRecap}
          title="🏆 Daily Recap & Dopamine Badges"
        >
          <Trophy size={13} color="#b08968" />
        </button>

        {/* Sync / Obsidian Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.22rem 0.4rem', fontSize: '0.72rem', background: '#fdfbf7' }}
          onClick={onOpenSync}
          title="📂 Sync Markdown / Obsidian / Backups"
        >
          <FolderSync size={13} color="#6b7c72" />
        </button>

        {/* Hover-to-Reveal Mode Cycle Button */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.22rem 0.4rem', fontSize: '0.72rem', background: modeInfo.bg }}
          onClick={onCycleHoverHideMode}
          title={modeInfo.title}
        >
          {modeInfo.icon}
        </button>

        {/* User Energy Switcher */}
        <div style={{ display: 'flex', gap: '2px', background: '#f5f2eb', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '2px' }}>
          <button
            type="button"
            title="Low Energy Mode (Rest 🪫)"
            style={{
              background: userEnergy === 'low' ? '#f7ece8' : 'transparent',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            onClick={() => onSetEnergy('low')}
          >
            🪫
          </button>
          <button
            type="button"
            title="Medium Energy Mode (Mindful ⚡)"
            style={{
              background: userEnergy === 'medium' ? '#f3ede2' : 'transparent',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            onClick={() => onSetEnergy('medium')}
          >
            ⚡
          </button>
          <button
            type="button"
            title="High Energy Mode (Flow 🚀)"
            style={{
              background: userEnergy === 'high' ? '#e3ede5' : 'transparent',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            onClick={() => onSetEnergy('high')}
          >
            🚀
          </button>
        </div>

        {/* Settings button */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem', background: '#fdfbf7' }}
          onClick={onOpenSettings}
          title="App Settings"
        >
          <Settings size={13} color="#6b7c72" />
        </button>
      </div>
    </header>
  );
};
