import React, { useReducer, useEffect, useState, useRef } from 'react';
import { appReducer, createInitialState } from './core/stateMachine';
import { loadStateFromStorage, saveStateToStorage, clearStateFromStorage } from './core/storage';
import { getDoThisNowTask } from './core/priorityEngine';
import { audioEngine } from './core/audioEngine';
import { HoverHideMode } from './types';

import { MacOSHeader } from './components/Layout/MacOSHeader';
import { MascotAvatar } from './components/Agent/MascotAvatar';
import { DoThisNowHero } from './components/Focus/DoThisNowHero';
import { SoundscapePlayer } from './components/Focus/SoundscapePlayer';
import { TaskList } from './components/Tasks/TaskList';
import { QuickCaptureInput } from './components/Tasks/QuickCaptureInput';
import { SettingsModal } from './components/Settings/SettingsModal';
import { AgentChatModal } from './components/Agent/AgentChatModal';

import './App.css';

export function App() {
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const saved = loadStateFromStorage();
    return saved || createInitialState();
  });

  const [isWideMode, setIsWideMode] = useState<boolean>(false);
  const [isMouseInside, setIsMouseInside] = useState<boolean>(true);
  const leaveDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // 1-second interval timer tick
  useEffect(() => {
    if (state.timer.status !== 'running') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timer.status]);

  const handleMouseEnter = () => {
    if (leaveDebounceRef.current) clearTimeout(leaveDebounceRef.current);
    setIsMouseInside(true);
  };

  const handleMouseLeave = () => {
    if (leaveDebounceRef.current) clearTimeout(leaveDebounceRef.current);
    leaveDebounceRef.current = setTimeout(() => {
      setIsMouseInside(false);
    }, 350);
  };

  const cycleHoverHideMode = () => {
    const modes: HoverHideMode[] = ['none', 'bottom_dock', 'edge_drawer', 'peek_dock', 'ghost_dim'];
    const currentIdx = modes.indexOf(state.settings.hoverHideMode || 'none');
    const nextMode = modes[(currentIdx + 1) % modes.length];
    if (state.settings.soundEnabled) audioEngine.playSfx('pop');
    dispatch({ type: 'UPDATE_SETTINGS', payload: { hoverHideMode: nextMode } });
  };

  const recommendedTask = getDoThisNowTask(state.tasks, state.settings.userEnergy);
  const activeFocusTask = state.tasks.find(t => t.id === state.timer.taskId) || recommendedTask;
  const hoverMode = state.settings.hoverHideMode || 'none';

  const formatMiniTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`app-wrapper ${isWideMode ? 'wide-mode' : ''} mode-${hoverMode} ${isMouseInside ? 'is-mouse-inside' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bottom Dock Mini Capsule */}
      <div
        className="bottom-dock-pill"
        onClick={() => setIsMouseInside(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MascotAvatar mood={state.agent.currentMood} size={28} />
          <div>
            <span style={{ fontSize: '0.78rem', color: '#1b4332', fontWeight: 700 }}>
              {state.timer.status === 'running' ? `⚡ ${formatMiniTimer(state.timer.remainingSeconds)}` : '🌿 Sanctuary'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeFocusTask?.title || 'No intention'}
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>▲</span>
      </div>

      {/* Edge Drawer Pull Tab */}
      <div
        className="edge-drawer-pull-tab"
        onClick={() => setIsMouseInside(true)}
      >
        <MascotAvatar mood={state.agent.currentMood} size={24} />
        <span className="tab-text" style={{ color: '#1b4332', fontWeight: 700 }}>
          {state.timer.status === 'running' ? `⚡ ${formatMiniTimer(state.timer.remainingSeconds)}` : '🌿 SANCTUARY'}
        </span>
        <span style={{ fontSize: '0.65rem' }}>◀</span>
      </div>

      {/* Peek Dock Banner */}
      <div
        className="peek-dock-mini-banner"
        onClick={() => setIsMouseInside(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MascotAvatar mood={state.agent.currentMood} size={26} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1b4332' }}>
            {state.timer.status === 'running' ? `⚡ ${formatMiniTimer(state.timer.remainingSeconds)}` : '🌿 Sanctuary'}
          </span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeFocusTask?.title || 'No intention'}
        </div>
      </div>

      {/* Header */}
      <MacOSHeader
        isWideMode={isWideMode}
        onToggleWideMode={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          setIsWideMode(!isWideMode);
        }}
        hoverHideMode={hoverMode}
        onCycleHoverHideMode={cycleHoverHideMode}
        onOpenSettings={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'TOGGLE_SETTINGS' });
        }}
        onReset={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('alert');
          clearStateFromStorage();
          dispatch({ type: 'RESET_STATE' });
        }}
      />

      {/* Main Grid Container */}
      <main className="app-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Mindful Guide Presence Quote & Chat Trigger */}
          <div className="agent-banner" style={{ background: '#ffffff', border: '1px solid var(--border-dark)', borderRadius: '14px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, cursor: 'pointer' }} onClick={() => dispatch({ type: 'POKE_AGENT' })}>
              <MascotAvatar
                mood={state.agent.currentMood}
                isTalking={state.agent.isTalking}
                size={38}
              />
              <div className="speech-bubble" style={{ flex: 1 }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.35, fontWeight: 500 }}>
                  "{state.agent.currentQuote}"
                </p>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                  🌱 Tap mascot or talk to AI
                </span>
              </div>
            </div>

            <button
              type="button"
              className="nb-btn"
              style={{
                background: '#d8f3dc',
                color: '#1b4332',
                border: '1.5px solid #b7e4c7',
                padding: '0.35rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0,
                cursor: 'pointer'
              }}
              onClick={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('pop');
                dispatch({ type: 'OPEN_CHAT_MODAL' });
              }}
              title="Open AI Dialogue & Coaching"
            >
              💬 Talk to AI
            </button>
          </div>

          {/* Unified North Star & Deep Flow Timer */}
          <DoThisNowHero
            task={activeFocusTask}
            timer={state.timer}
            onStartFocus={(taskId) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('ding');
              dispatch({ type: 'START_FOCUS', payload: { taskId } });
            }}
            onPauseFocus={() => {
              if (state.settings.soundEnabled) audioEngine.playSfx('alert');
              dispatch({ type: 'PAUSE_FOCUS' });
            }}
            onResumeFocus={() => {
              if (state.settings.soundEnabled) audioEngine.playSfx('ding');
              dispatch({ type: 'RESUME_FOCUS' });
            }}
            onExtendFocus={() => {
              if (state.settings.soundEnabled) audioEngine.playSfx('ding');
              dispatch({ type: 'EXTEND_TIMER' });
            }}
            onCompleteFocus={() => {
              if (state.settings.soundEnabled) audioEngine.playSfx('fanfare');
              dispatch({ type: 'COMPLETE_FOCUS' });
            }}
          />

          {/* Integrated Ambience Soundscapes */}
          <SoundscapePlayer isTimerRunning={state.timer.status === 'running'} />
        </div>

        {/* Intentions Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <TaskList
            tasks={state.tasks}
            activeTaskId={state.activeTaskId}
            onSelectTask={(id) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('pop');
              dispatch({ type: 'SELECT_TASK', payload: { id } });
            }}
            onToggleComplete={(id) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('fanfare');
              dispatch({ type: 'TOGGLE_TASK_COMPLETE', payload: { id } });
            }}
          />
        </div>
      </main>

      {/* Minimal Bottom Input */}
      <QuickCaptureInput
        onAddTask={(taskData) => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'ADD_TASK', payload: taskData });
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={state.isSettingsOpen}
        settings={state.settings}
        onClose={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
        onUpdateSettings={(newSettings) => dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })}
        onResetAllData={() => {
          clearStateFromStorage();
          dispatch({ type: 'RESET_STATE' });
        }}
      />

      {/* Interactive AI Chat & Coaching Modal */}
      <AgentChatModal
        agent={state.agent}
        task={activeFocusTask}
        userEnergy={state.settings.userEnergy || 'medium'}
        timer={state.timer}
        isOpen={state.isChatModalOpen}
        soundEnabled={state.settings.soundEnabled}
        voiceEnabled={state.settings.voiceEnabled}
        geminiApiKey={state.settings.geminiApiKey}
        onClose={() => dispatch({ type: 'CLOSE_CHAT_MODAL' })}
        onAddMessage={(msg) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: msg })}
        onSetTalking={(talking) => dispatch({ type: 'SET_AGENT_TALKING', payload: talking })}
        onStartFocus={(taskId) => {
          if (state.settings.soundEnabled) audioEngine.playSfx('ding');
          dispatch({ type: 'START_FOCUS', payload: { taskId } });
          dispatch({ type: 'CLOSE_CHAT_MODAL' });
        }}
        onApplySteps={(taskId, microSteps) => {
          dispatch({ type: 'APPLY_MICRO_STEPS', payload: { taskId, microSteps } });
        }}
      />
    </div>
  );
}
export default App;
