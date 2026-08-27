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
        return { label: 'Bottom Dock', icon: <Minimize2 size={13} />, bg: '#86efac', title: '🚀 Bottom Dock: Floats as a bottom pill and expands UPWARD when hovered' };
      case 'edge_drawer':
        return { label: 'Edge Drawer', icon: <Minimize2 size={13} />, bg: '#fef08a', title: '🪄 Edge Slide-out: Slides into the right bezel of your Mac' };
      case 'peek_dock':
        return { label: 'Peek Dock', icon: <Minimize2 size={13} />, bg: '#fed7aa', title: 'Hover-to-Reveal: Collapses to mini pill when cursor leaves' };
      case 'ghost_dim':
        return { label: 'Ghost Dim', icon: <Eye size={13} />, bg: '#d8b4fe', title: 'Hover-to-Reveal: Dims translucent when cursor leaves' };
      case 'none':
      default:
        return { label: 'Pinned Open', icon: <Pin size={13} />, bg: '#ffffff', title: '📌 Pinned Open: Always fully visible' };
    }
  };

  const modeInfo = getHoverModeLabel();

  return (
    <header className="macos-header">
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
        <Sparkles size={16} color="#eab308" fill="#eab308" />
        <span>NudgeBuddy</span>
        <span style={{ fontSize: '0.65rem', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #121826' }}>
          macOS
        </span>
      </div>

      <div className="header-controls">
        {/* Brain Dump Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem', background: '#fef08a' }}
          onClick={onOpenBrainDump}
          title="🧠 Open Brain Dump AI Parser"
        >
          <Brain size={13} color="#854d0e" />
        </button>

        {/* Daily Recap Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem', background: '#bbf7d0' }}
          onClick={onOpenDailyRecap}
          title="🏆 Daily Recap & Dopamine Badges"
        >
          <Trophy size={13} color="#166534" />
        </button>

        {/* Sync / Obsidian Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem', background: '#bfdbfe' }}
          onClick={onOpenSync}
          title="📂 Sync Markdown / Obsidian / Backups"
        >
          <FolderSync size={13} color="#1e40af" />
        </button>

        {/* Hover-to-Reveal Mode Cycle Button */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem', background: modeInfo.bg }}
          onClick={onCycleHoverHideMode}
          title={modeInfo.title}
        >
          {modeInfo.icon}
        </button>

        {/* User Energy Switcher */}
        <div style={{ display: 'flex', gap: '2px', background: '#f1f5f9', border: '1.5px solid #121826', borderRadius: '6px', padding: '2px' }}>
          <button
            type="button"
            title="Low Energy Mode (Zombie 🪫)"
            style={{
              background: userEnergy === 'low' ? '#fca5a5' : 'transparent',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            onClick={() => onSetEnergy('low')}
          >
            🪫
          </button>
          <button
            type="button"
            title="Medium Energy Mode (Normal ⚡)"
            style={{
              background: userEnergy === 'medium' ? '#fed7aa' : 'transparent',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            onClick={() => onSetEnergy('medium')}
          >
            ⚡
          </button>
          <button
            type="button"
            title="High Energy Mode (Beast 🚀)"
            style={{
              background: userEnergy === 'high' ? '#86efac' : 'transparent',
              border: 'none',
              padding: '2px 5px',
              borderRadius: '4px',
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
          style={{ padding: '0.3rem 0.45rem', fontSize: '0.75rem' }}
          onClick={onOpenSettings}
          title="App Settings"
        >
          <Settings size={14} />
        </button>
      </div>
    </header>
  );
};
