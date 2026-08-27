import React from 'react';
import { HoverHideMode } from '../../types';
import { Settings, Leaf, Sparkles, Minimize2, Pin, Eye } from 'lucide-react';

interface MacOSHeaderProps {
  isWideMode: boolean;
  onToggleWideMode: () => void;
  hoverHideMode: HoverHideMode;
  onCycleHoverHideMode: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
}

export const MacOSHeader: React.FC<MacOSHeaderProps> = ({
  onToggleWideMode,
  hoverHideMode,
  onCycleHoverHideMode,
  onOpenSettings,
  onReset
}) => {
  const getHoverModeLabel = () => {
    switch (hoverHideMode) {
      case 'bottom_dock':
        return { label: 'Bottom Dock', icon: <Minimize2 size={13} />, bg: '#eef2ff', title: '🚀 Bottom Dock: Floats as a bottom pill and expands UPWARD when hovered' };
      case 'edge_drawer':
        return { label: 'Edge Drawer', icon: <Minimize2 size={13} />, bg: '#f1f3f5', title: '🪄 Edge Slide-out: Slides into the right bezel of your Mac' };
      case 'peek_dock':
        return { label: 'Peek Dock', icon: <Minimize2 size={13} />, bg: '#f8f9fa', title: 'Hover-to-Reveal: Collapses to mini pill when cursor leaves' };
      case 'ghost_dim':
        return { label: 'Ghost Dim', icon: <Eye size={13} />, bg: '#fdf2f8', title: 'Hover-to-Reveal: Dims translucent when cursor leaves' };
      case 'none':
      default:
        return { label: 'Pinned Open', icon: <Pin size={13} />, bg: '#ffffff', title: '📌 Pinned Open: Always fully visible' };
    }
  };

  const modeInfo = getHoverModeLabel();

  return (
    <header className="macos-header" style={{ background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', padding: '0.65rem 0.9rem' }}>
      <div className="traffic-lights">
        <div
          className="dot dot-red"
          title="Reset"
          onClick={() => {
            if (confirm('Clear and reset intentions?')) {
              onReset();
            }
          }}
        />
        <div
          className="dot dot-yellow"
          title="Toggle View"
          onClick={onToggleWideMode}
        />
        <div
          className="dot dot-green"
          title="Toggle View"
          onClick={onToggleWideMode}
        />
      </div>

      <div className="header-title-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <Leaf size={14} color="#2d6a4f" fill="#52b788" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 700, color: '#1b4332', letterSpacing: '-0.2px' }}>NudgeBuddy</span>
        <span style={{ fontSize: '0.62rem', background: '#d8f3dc', color: '#1b4332', border: '1px solid #b7e4c7', padding: '0.12rem 0.45rem', borderRadius: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
          🌿 SANCTUARY
        </span>
      </div>

      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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

        {/* Settings button */}
        <button
          type="button"
          className="nb-btn"
          style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem', background: '#ffffff' }}
          onClick={onOpenSettings}
          title="Settings"
        >
          <Settings size={13} color="#64748b" />
        </button>
      </div>
    </header>
  );
};
