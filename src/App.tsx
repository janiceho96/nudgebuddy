import React, { useReducer, useEffect, useState, useRef } from 'react';
import { appReducer, createInitialState, AppState } from './core/stateMachine';
import { loadStateFromStorage, saveStateToStorage, clearStateFromStorage } from './core/storage';
import { getDoThisNowTask } from './core/priorityEngine';
import { audioEngine } from './core/audioEngine';
import { HoverHideMode, Task } from './types';

import { MacOSHeader } from './components/Layout/MacOSHeader';
import { MascotAvatar } from './components/Agent/MascotAvatar';
import { AgentSpeechBubble } from './components/Agent/AgentSpeechBubble';
import { PersonalitySelector } from './components/Agent/PersonalitySelector';
import { AgentChatModal } from './components/Agent/AgentChatModal';
import { DoThisNowHero } from './components/Focus/DoThisNowHero';
import { FocusTimer25m } from './components/Focus/FocusTimer25m';
import { SoundscapePlayer } from './components/Focus/SoundscapePlayer';
import { AvoidanceInterventionModal } from './components/Focus/AvoidanceInterventionModal';
import { BrainDumpModal } from './components/BrainDump/BrainDumpModal';
import { DailyRecapModal } from './components/Stats/DailyRecapModal';
import { SyncModal } from './components/Sync/SyncModal';
import { TaskList } from './components/Tasks/TaskList';
import { QuickCaptureInput } from './components/Tasks/QuickCaptureInput';
import { TaskDetailDrawer } from './components/Tasks/TaskDetailDrawer';
import { SettingsModal } from './components/Settings/SettingsModal';

import './App.css';

export function App() {
  const [state, dispatch] = useReducer(appReducer, null, () => {
    const saved = loadStateFromStorage();
    return saved || createInitialState();
  });

  const [isWideMode, setIsWideMode] = useState<boolean>(false);
  const [isMouseInside, setIsMouseInside] = useState<boolean>(true);
  const leaveDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Idle Nudge Detection (Throttled to prevent CPU spikes on rapid mouse moves)
  useEffect(() => {
    let lastThrottledTime = 0;

    const resetIdleTimer = () => {
      const now = Date.now();
      if (now - lastThrottledTime < 2500) return; // Only process once every 2.5 seconds
      lastThrottledTime = now;

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (state.timer.status === 'idle') {
        idleTimerRef.current = setTimeout(() => {
          if (state.timer.status === 'idle') {
            dispatch({ type: 'POKE_AGENT' });
          }
        }, 60000); // 60s idle check
      }
    };

    window.addEventListener('mousemove', resetIdleTimer, { passive: true });
    window.addEventListener('keydown', resetIdleTimer, { passive: true });
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
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

  // Dynamically compute current recommended "Do This Now" task
  const recommendedTask = getDoThisNowTask(state.tasks, state.settings.userEnergy);
  const activeFocusTask = state.tasks.find(t => t.id === state.timer.taskId) || recommendedTask;
  const detailTask = state.tasks.find(t => t.id === state.detailDrawerTaskId) || null;
  const avoidanceTask = state.tasks.find(t => t.id === state.avoidanceModalTaskId) || null;

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
      {/* Bottom Dock Mini Pill (When docked at bottom of screen) */}
      <div
        className="bottom-dock-pill"
        onClick={() => setIsMouseInside(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MascotAvatar mood={state.agent.currentMood} size={30} />
          <div>
            <span style={{ fontSize: '0.78rem', color: '#121826' }}>
              {state.timer.status === 'running' ? `⚡ ${formatMiniTimer(state.timer.remainingSeconds)}` : '🎯 Focus Dock'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.72rem', color: '#475569', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeFocusTask?.title || 'No task'}
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#121826' }}>▲</span>
      </div>

      {/* Edge Drawer Pull Tab (Protruding tab when docked to Mac right bezel) */}
      <div
        className="edge-drawer-pull-tab"
        onClick={() => setIsMouseInside(true)}
      >
        <MascotAvatar mood={state.agent.currentMood} size={28} />
        <span className="tab-text">
          {state.timer.status === 'running' ? `⏱️ ${formatMiniTimer(state.timer.remainingSeconds)}` : '👾 BUDGE'}
        </span>
        <span style={{ fontSize: '0.65rem' }}>◀</span>
      </div>

      {/* Mini Edge Dock Banner when collapsed in peek_dock mode */}
      <div
        className="peek-dock-mini-banner"
        onClick={() => setIsMouseInside(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MascotAvatar mood={state.agent.currentMood} size={30} />
          <div>
            <span style={{ fontSize: '0.78rem', color: '#121826' }}>
              {state.timer.status === 'running' ? `⚡ ${formatMiniTimer(state.timer.remainingSeconds)}` : '🎯 Focus Peek'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.72rem', color: '#475569', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeFocusTask?.title || 'No task'}
        </div>
      </div>

      {/* macOS Window Header */}
      <MacOSHeader
        isWideMode={isWideMode}
        onToggleWideMode={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          setIsWideMode(!isWideMode);
        }}
        userEnergy={state.settings.userEnergy}
        onSetEnergy={(energy) => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'SET_USER_ENERGY', payload: energy });
        }}
        hoverHideMode={hoverMode}
        onCycleHoverHideMode={cycleHoverHideMode}
        onOpenBrainDump={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'TOGGLE_BRAIN_DUMP' });
        }}
        onOpenDailyRecap={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'TOGGLE_DAILY_RECAP' });
        }}
        onOpenSync={() => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'TOGGLE_SYNC_MODAL' });
        }}
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
        {/* Left Column / Top Section: Mascot & Hero Focus */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Agent Section */}
          <div className="agent-banner">
            <MascotAvatar
              mood={state.agent.currentMood}
              isTalking={state.agent.isTalking}
              size={62}
              onClick={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('boing');
                dispatch({ type: 'OPEN_CHAT_MODAL' });
              }}
            />
            <AgentSpeechBubble
              agent={state.agent}
              voiceEnabled={state.settings.voiceEnabled}
              onPoke={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('boing');
                dispatch({ type: 'POKE_AGENT' });
              }}
              onOpenChat={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('pop');
                dispatch({ type: 'OPEN_CHAT_MODAL' });
              }}
              onSetTalking={(talking) => dispatch({ type: 'SET_AGENT_TALKING', payload: talking })}
            />
          </div>

          {/* Persona Switcher Quick Bar */}
          <PersonalitySelector
            currentPersona={state.agent.persona}
            onSelect={(persona) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('pop');
              dispatch({ type: 'SET_PERSONA', payload: persona });
            }}
          />

          {/* Integrated Soundscape Player */}
          <SoundscapePlayer isTimerRunning={state.timer.status === 'running'} />

          {/* Active 25m Timer (Visible when running or paused) */}
          {(state.timer.status === 'running' || state.timer.status === 'paused') ? (
            <FocusTimer25m
              timer={state.timer}
              task={activeFocusTask}
              onPause={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('alert');
                dispatch({ type: 'PAUSE_FOCUS' });
              }}
              onResume={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('ding');
                dispatch({ type: 'RESUME_FOCUS' });
              }}
              onExtend={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('ding');
                dispatch({ type: 'EXTEND_TIMER' });
              }}
              onComplete={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('fanfare');
                dispatch({ type: 'COMPLETE_FOCUS' });
              }}
              onGiveUp={() => {
                if (state.settings.soundEnabled) audioEngine.playSfx('snooze');
                dispatch({ type: 'GIVE_UP_FOCUS' });
              }}
            />
          ) : (
            /* Do This Now Recommendation Hero Card */
            <DoThisNowHero
              task={recommendedTask}
              timer={state.timer}
              onStartFocus={(taskId) => {
                if (state.settings.soundEnabled) audioEngine.playSfx('ding');
                dispatch({ type: 'START_FOCUS', payload: { taskId } });
              }}
              onSnooze={(taskId) => {
                if (state.settings.soundEnabled) audioEngine.playSfx('snooze');
                dispatch({ type: 'SNOOZE_TASK', payload: { id: taskId } });
              }}
              onOpenDetails={(taskId) => {
                if (state.settings.soundEnabled) audioEngine.playSfx('pop');
                dispatch({ type: 'OPEN_DETAIL_DRAWER', payload: { taskId } });
              }}
              onOpenAvoidance={(taskId) => {
                if (state.settings.soundEnabled) audioEngine.playSfx('alert');
                dispatch({ type: 'OPEN_AVOIDANCE_MODAL', payload: { taskId } });
              }}
            />
          )}
        </div>

        {/* Right Column / Bottom Section: Task Management Inbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <TaskList
            tasks={state.tasks}
            activeTaskId={state.activeTaskId}
            filter={state.selectedFilter}
            onSetFilter={(filter) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('pop');
              dispatch({ type: 'SET_FILTER', payload: filter });
            }}
            onSelectTask={(id) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('pop');
              dispatch({ type: 'SELECT_TASK', payload: { id } });
            }}
            onToggleComplete={(id) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('fanfare');
              dispatch({ type: 'TOGGLE_TASK_COMPLETE', payload: { id } });
            }}
            onOpenDetails={(id) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('pop');
              dispatch({ type: 'OPEN_DETAIL_DRAWER', payload: { taskId: id } });
            }}
            onSnooze={(id) => {
              if (state.settings.soundEnabled) audioEngine.playSfx('snooze');
              dispatch({ type: 'SNOOZE_TASK', payload: { id } });
            }}
          />
        </div>
      </main>

      {/* Sticky Bottom Quick Capture */}
      <QuickCaptureInput
        onAddTask={(taskData) => {
          if (state.settings.soundEnabled) audioEngine.playSfx('pop');
          dispatch({ type: 'ADD_TASK', payload: taskData });
        }}
      />

      {/* Interactive Agent Chat Modal */}
      <AgentChatModal
        agent={state.agent}
        task={activeFocusTask}
        userEnergy={state.settings.userEnergy}
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
        }}
        onApplySteps={(taskId, steps) => {
          if (state.settings.soundEnabled) audioEngine.playSfx('boing');
          dispatch({ type: 'APPLY_MICRO_STEPS', payload: { taskId, microSteps: steps } });
        }}
      />

      {/* Avoidance Intervention Wizard Modal */}
      {state.isAvoidanceModalOpen && (
        <AvoidanceInterventionModal
          task={avoidanceTask}
          onClose={() => dispatch({ type: 'CLOSE_AVOIDANCE_MODAL' })}
          onApplySteps={(taskId, steps) => {
            if (state.settings.soundEnabled) audioEngine.playSfx('boing');
            dispatch({ type: 'APPLY_MICRO_STEPS', payload: { taskId, microSteps: steps } });
          }}
          onStartStepFocus={(taskId) => {
            if (state.settings.soundEnabled) audioEngine.playSfx('ding');
            dispatch({ type: 'START_FOCUS', payload: { taskId } });
          }}
        />
      )}

      {/* Brain Dump AI Modal */}
      <BrainDumpModal
        isOpen={state.isBrainDumpOpen}
        onClose={() => dispatch({ type: 'TOGGLE_BRAIN_DUMP' })}
        onBatchAddTasks={(tasks) => dispatch({ type: 'BATCH_ADD_TASKS', payload: tasks })}
      />

      {/* Daily Recap & Stats Modal */}
      <DailyRecapModal
        tasks={state.tasks}
        isOpen={state.isDailyRecapOpen}
        onClose={() => dispatch({ type: 'TOGGLE_DAILY_RECAP' })}
      />

      {/* Sync & Ecosystem Modal */}
      <SyncModal
        state={state}
        isOpen={state.isSyncModalOpen}
        onClose={() => dispatch({ type: 'TOGGLE_SYNC_MODAL' })}
        onImportTasks={(tasks) => dispatch({ type: 'BATCH_ADD_TASKS', payload: tasks })}
        onRestoreState={(restored) => dispatch({ type: 'LOAD_SAVED_STATE', payload: restored })}
      />

      {/* Task Detail Drawer Modal */}
      {state.isDetailDrawerOpen && (
        <TaskDetailDrawer
          task={detailTask}
          onClose={() => dispatch({ type: 'CLOSE_DETAIL_DRAWER' })}
          onUpdateTask={(updated) => dispatch({ type: 'UPDATE_TASK', payload: { task: updated } })}
          onDeleteTask={(id) => {
            if (state.settings.soundEnabled) audioEngine.playSfx('alert');
            dispatch({ type: 'DELETE_TASK', payload: { id } });
          }}
          onStartFocus={(taskId) => {
            if (state.settings.soundEnabled) audioEngine.playSfx('ding');
            dispatch({ type: 'START_FOCUS', payload: { taskId } });
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        settings={state.settings}
        isOpen={state.isSettingsOpen}
        onClose={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
        onUpdateSettings={(updated) => dispatch({ type: 'UPDATE_SETTINGS', payload: updated })}
        onResetAllData={() => {
          clearStateFromStorage();
          dispatch({ type: 'RESET_STATE' });
        }}
      />
    </div>
  );
}

export default App;
