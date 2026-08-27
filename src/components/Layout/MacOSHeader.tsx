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
  onMouseDown?: () => void;
  onMouseUp?: () => void;
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
  onReset,
  onMouseDown,
  onMouseUp
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
        return { label: 'Pinned Open', icon: <Pin size={13} />, bg: '#ffffff', title: '📌 Pinned Open: Always fully visible (will not minimize when dragged)' };
    }
  };

  const modeInfo = getHoverModeLabel();

  return (
    <header className="macos-header" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
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

      <div className="header-title-badge" style={{ gap: '0.35rem', fontSize: '0.85rem' }}>
        <Sparkles size={14} color="#eab308" fill="#eab308" />
        <span style={{ fontWeight: 900 }}>NudgeBuddy</span>
      </div>

      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* Brain Dump Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem', background: '#fef08a' }}
          onClick={onOpenBrainDump}
          title="🧠 Open Brain Dump AI Parser"
        >
          <Brain size={13} color="#854d0e" />
        </button>

        {/* Daily Recap Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem', background: '#bbf7d0' }}
          onClick={onOpenDailyRecap}
          title="🏆 Daily Recap & Dopamine Badges"
        >
          <Trophy size={13} color="#166534" />
        </button>

        {/* Sync / Obsidian Action */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem', background: '#bfdbfe' }}
          onClick={onOpenSync}
          title="📂 Sync Markdown / Obsidian / Backups"
        >
          <FolderSync size={13} color="#1e40af" />
        </button>

        {/* Hover-to-Reveal Mode Cycle Button */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem', background: modeInfo.bg }}
          onClick={onCycleHoverHideMode}
          title={modeInfo.title}
        >
          {modeInfo.icon}
        </button>

        {/* Settings button */}
        <button
          type="button"
          className="nb-btn"
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.72rem',
            background: '#d8b4fe',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenSettings();
          }}
          title="⚙️ App Settings"
        >
          <Settings size={13} />
          <span style={{ fontWeight: 800 }}>Settings</span>
        </button>
      </div>
    </header>
  );
};
