import React from 'react';
import { EnergyLevel, HoverHideMode } from '../../types';
import { Settings, Sparkles, EyeOff, Pin, Brain, Trophy, FolderSync, ArrowDownToLine, PanelRightClose } from 'lucide-react';

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
        return { label: 'Bottom Dock', icon: <ArrowDownToLine size={13} />, bg: '#86efac', title: '🚀 Bottom Dock: Shrinks to bottom corner pill and pops up on hover' };
      case 'edge_drawer':
        return { label: 'Edge Drawer', icon: <PanelRightClose size={13} />, bg: '#fef08a', title: '🪄 Edge Drawer: Tucks into the right edge of your screen' };
      case 'ghost_dim':
        return { label: 'Ghost Dim', icon: <EyeOff size={13} />, bg: '#d8b4fe', title: '👁️ Ghost Dim: Dims translucent when you move away' };
      case 'none':
      default:
        return { label: 'Pinned Open', icon: <Pin size={13} />, bg: '#ffffff', title: '📌 Pinned Open: Always visible on your desktop' };
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
