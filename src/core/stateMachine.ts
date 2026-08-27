import { Task, FocusSession, AgentState, AppSettings, AgentPersona, EnergyLevel, MicroStep, ChatMessage } from '../types';
import { INITIAL_MOCK_TASKS } from './mockData';
import { getAgentDialogue, getRandomBanter } from './agentDialogueEngine';
import { checkAvoidance, generateMicroStepsForTask } from './avoidanceDetector';
import { getDoThisNowTask } from './priorityEngine';

export interface AppState {
  tasks: Task[];
  activeTaskId: string | null;
  timer: FocusSession;
  agent: AgentState;
  settings: AppSettings;
  selectedFilter: 'all' | 'avoided' | 'completed';
  isAvoidanceModalOpen: boolean;
  avoidanceModalTaskId: string | null;
  isDetailDrawerOpen: boolean;
  detailDrawerTaskId: string | null;
  isSettingsOpen: boolean;
  isChatModalOpen: boolean;
  isBrainDumpOpen: boolean;
  isDailyRecapOpen: boolean;
  isSyncModalOpen: boolean;
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: { title: string; estimatedMinutes?: number; tags?: string[]; urgency?: Task['urgency']; energyLevel?: EnergyLevel; notes?: string } }
  | { type: 'BATCH_ADD_TASKS'; payload: Task[] }
  | { type: 'SELECT_TASK'; payload: { id: string } }
  | { type: 'START_FOCUS'; payload?: { taskId?: string } }
  | { type: 'PAUSE_FOCUS' }
  | { type: 'RESUME_FOCUS' }
  | { type: 'TICK_TIMER' }
  | { type: 'EXTEND_TIMER' }
  | { type: 'COMPLETE_FOCUS' }
  | { type: 'GIVE_UP_FOCUS' }
  | { type: 'SNOOZE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_TASK_COMPLETE'; payload: { id: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'UPDATE_TASK'; payload: { task: Task } }
  | { type: 'OPEN_AVOIDANCE_MODAL'; payload: { taskId: string } }
  | { type: 'CLOSE_AVOIDANCE_MODAL' }
  | { type: 'APPLY_MICRO_STEPS'; payload: { taskId: string; microSteps: MicroStep[] } }
  | { type: 'TOGGLE_MICRO_STEP'; payload: { taskId: string; stepId: string } }
  | { type: 'OPEN_DETAIL_DRAWER'; payload: { taskId: string } }
  | { type: 'CLOSE_DETAIL_DRAWER' }
  | { type: 'SET_PERSONA'; payload: AgentPersona }
  | { type: 'SET_USER_ENERGY'; payload: EnergyLevel }
  | { type: 'SET_FILTER'; payload: 'all' | 'avoided' | 'completed' }
  | { type: 'POKE_AGENT' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TOGGLE_CHAT_MODAL' }
  | { type: 'OPEN_CHAT_MODAL' }
  | { type: 'CLOSE_CHAT_MODAL' }
  | { type: 'TOGGLE_BRAIN_DUMP' }
  | { type: 'TOGGLE_DAILY_RECAP' }
  | { type: 'TOGGLE_SYNC_MODAL' }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_AGENT_TALKING'; payload: boolean }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_SAVED_STATE'; payload: AppState };

export function createInitialState(): AppState {
  const initialPersona: AgentPersona = 'gentle';
  const initialDialogue = getAgentDialogue('ON_INIT', initialPersona);

  const initialTasks = [...INITIAL_MOCK_TASKS];
  const initialRecommended = getDoThisNowTask(initialTasks, 'medium');

  const initialChat: ChatMessage[] = [
    {
      id: 'init-msg',
      sender: 'agent',
      text: initialDialogue.quote,
      mood: initialDialogue.mood,
      timestamp: new Date().toISOString()
    }
  ];

  return {
    tasks: initialTasks,
    activeTaskId: initialRecommended ? initialRecommended.id : (initialTasks[0]?.id ?? null),
    timer: {
      taskId: initialRecommended ? initialRecommended.id : (initialTasks[0]?.id ?? ''),
      totalDurationSeconds: 1500, // 25 minutes
      remainingSeconds: 1500,
      status: 'idle',
      extendedCount: 0
    },
    agent: {
      name: 'Budge',
      persona: initialPersona,
      currentMood: initialDialogue.mood,
      currentQuote: initialDialogue.quote,
      lastEvent: 'ON_INIT',
      pokeCount: 0,
      isTalking: false,
      chatHistory: initialChat
    },
    settings: {
      defaultPersona: initialPersona,
      proactivity: 'balanced',
      userEnergy: 'medium',
      focusDurationMinutes: 25,
      soundEnabled: true,
      voiceEnabled: true,
      compactMode: false,
      hoverHideMode: 'none'
    },
    selectedFilter: 'all',
    isAvoidanceModalOpen: false,
    avoidanceModalTaskId: null,
    isDetailDrawerOpen: false,
    detailDrawerTaskId: null,
    isSettingsOpen: false,
    isChatModalOpen: false,
    isBrainDumpOpen: false,
    isDailyRecapOpen: false,
    isSyncModalOpen: false
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const { title, estimatedMinutes = 25, tags = [], urgency = 'medium', energyLevel = 'medium', notes = '' } = action.payload;
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: title.trim(),
        notes,
        estimatedMinutes,
        energyLevel,
        urgency,
        tags,
        status: 'inbox',
        snoozeCount: 0,
        createdAt: new Date().toISOString(),
        abandonCount: 0,
        totalFocusMinutes: 0,
        microSteps: []
      };

      const updatedTasks = [newTask, ...state.tasks];
      const dialogue = getAgentDialogue('ON_TASK_ADD', state.agent.persona, newTask);

      const newChat: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: dialogue.quote,
        mood: dialogue.mood,
        timestamp: new Date().toISOString()
      };

      return {
        ...state,
        tasks: updatedTasks,
        activeTaskId: state.activeTaskId || newTask.id,
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_TASK_ADD',
          chatHistory: [...(state.agent.chatHistory || []), newChat]
        }
      };
    }

    case 'SELECT_TASK': {
      const selectedTask = state.tasks.find(t => t.id === action.payload.id);
      if (!selectedTask) return state;

      const dialogue = getAgentDialogue('ON_TASK_SELECT', state.agent.persona, selectedTask);

      const newChat: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: dialogue.quote,
        mood: dialogue.mood,
        timestamp: new Date().toISOString()
      };

      return {
        ...state,
        activeTaskId: selectedTask.id,
        timer: {
          ...state.timer,
          taskId: selectedTask.id,
          remainingSeconds: state.settings.focusDurationMinutes * 60,
          totalDurationSeconds: state.settings.focusDurationMinutes * 60,
          status: 'idle'
        },
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_TASK_SELECT',
          chatHistory: [...(state.agent.chatHistory || []), newChat]
        }
      };
    }

    case 'START_FOCUS': {
      const targetId = action.payload?.taskId || state.activeTaskId || state.tasks[0]?.id;
      const task = state.tasks.find(t => t.id === targetId);
      if (!task) return state;

      const dialogue = getAgentDialogue('ON_FOCUS_START', state.agent.persona, task);

      const newChat: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: dialogue.quote,
        mood: dialogue.mood,
        timestamp: new Date().toISOString()
      };

      return {
        ...state,
        activeTaskId: task.id,
        isChatModalOpen: false,
        timer: {
          taskId: task.id,
          totalDurationSeconds: state.timer.totalDurationSeconds || state.settings.focusDurationMinutes * 60,
          remainingSeconds: state.timer.status === 'paused' ? state.timer.remainingSeconds : state.settings.focusDurationMinutes * 60,
          status: 'running',
          startedAt: new Date().toISOString(),
          extendedCount: state.timer.extendedCount
        },
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_FOCUS_START',
          chatHistory: [...(state.agent.chatHistory || []), newChat]
        }
      };
    }

    case 'PAUSE_FOCUS': {
      const activeTask = state.tasks.find(t => t.id === state.timer.taskId);
      const dialogue = getAgentDialogue('ON_FOCUS_PAUSE', state.agent.persona, activeTask);

      return {
        ...state,
        timer: {
          ...state.timer,
          status: 'paused',
          pausedAt: new Date().toISOString()
        },
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_FOCUS_PAUSE'
        }
      };
    }

    case 'RESUME_FOCUS': {
      const activeTask = state.tasks.find(t => t.id === state.timer.taskId);
      const dialogue = getAgentDialogue('ON_FOCUS_RESUME', state.agent.persona, activeTask);

      return {
        ...state,
        timer: {
          ...state.timer,
          status: 'running'
        },
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_FOCUS_RESUME'
        }
      };
    }

    case 'TICK_TIMER': {
      if (state.timer.status !== 'running') return state;

      const nextRemaining = state.timer.remainingSeconds - 1;
      if (nextRemaining <= 0) {
        return appReducer(state, { type: 'COMPLETE_FOCUS' });
      }

      // Increment focus minutes on the task every 60 seconds
      const elapsedSeconds = state.timer.totalDurationSeconds - nextRemaining;
      let updatedTasks = state.tasks;
      if (elapsedSeconds % 60 === 0 && state.timer.taskId) {
        updatedTasks = state.tasks.map(t =>
          t.id === state.timer.taskId
            ? { ...t, totalFocusMinutes: t.totalFocusMinutes + 1 }
            : t
        );
      }

      return {
        ...state,
        tasks: updatedTasks,
        timer: {
          ...state.timer,
          remainingSeconds: nextRemaining
        }
      };
    }

    case 'EXTEND_TIMER': {
      return {
        ...state,
        timer: {
          ...state.timer,
          remainingSeconds: state.timer.remainingSeconds + 300,
          totalDurationSeconds: state.timer.totalDurationSeconds + 300,
          extendedCount: state.timer.extendedCount + 1
        }
      };
    }

    case 'COMPLETE_FOCUS': {
      const activeTask = state.tasks.find(t => t.id === state.timer.taskId);
      const dialogue = getAgentDialogue('ON_FOCUS_COMPLETE', state.agent.persona, activeTask);

      const updatedTasks = state.tasks.map(t =>
        t.id === state.timer.taskId
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
          : t
      );

      const nextRecommended = getDoThisNowTask(updatedTasks, state.settings.userEnergy);

      const newChat: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: dialogue.quote,
        mood: dialogue.mood,
        timestamp: new Date().toISOString()
      };

      return {
        ...state,
        tasks: updatedTasks,
        activeTaskId: nextRecommended ? nextRecommended.id : null,
        timer: {
          ...state.timer,
          status: 'completed',
          remainingSeconds: 0
        },
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_FOCUS_COMPLETE',
          chatHistory: [...(state.agent.chatHistory || []), newChat]
        }
      };
    }

    case 'GIVE_UP_FOCUS': {
      const activeTask = state.tasks.find(t => t.id === state.timer.taskId);
      const dialogue = getAgentDialogue('ON_FOCUS_GIVE_UP', state.agent.persona, activeTask);

      const updatedTasks = state.tasks.map(t =>
        t.id === state.timer.taskId
          ? { ...t, abandonCount: t.abandonCount + 1 }
          : t
      );

      return {
        ...state,
        tasks: updatedTasks,
        timer: {
          ...state.timer,
          status: 'idle',
          remainingSeconds: state.settings.focusDurationMinutes * 60
        },
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_FOCUS_GIVE_UP'
        }
      };
    }

    case 'SNOOZE_TASK': {
      let isAvoidanceTriggered = false;
      let targetTaskId = action.payload.id;

      const updatedTasks = state.tasks.map(t => {
        if (t.id === targetTaskId) {
          const nextSnoozeCount = t.snoozeCount + 1;
          const updated = {
            ...t,
            snoozeCount: nextSnoozeCount,
            lastSnoozedAt: new Date().toISOString()
          };
          const avoidanceCheck = checkAvoidance(updated);
          if (avoidanceCheck.isAvoided) {
            updated.isAvoided = true;
            isAvoidanceTriggered = true;
          }
          return updated;
        }
        return t;
      });

      const snoozedTask = updatedTasks.find(t => t.id === targetTaskId);
      const dialogue = getAgentDialogue(
        isAvoidanceTriggered ? 'ON_AVOIDANCE_DETECTED' : 'ON_SNOOZE',
        state.agent.persona,
        snoozedTask
      );

      const nextRec = getDoThisNowTask(updatedTasks, state.settings.userEnergy);

      return {
        ...state,
        tasks: updatedTasks,
        activeTaskId: nextRec ? nextRec.id : state.activeTaskId,
        isAvoidanceModalOpen: isAvoidanceTriggered,
        avoidanceModalTaskId: isAvoidanceTriggered ? targetTaskId : null,
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: isAvoidanceTriggered ? 'ON_AVOIDANCE_DETECTED' : 'ON_SNOOZE'
        }
      };
    }

    case 'TOGGLE_TASK_COMPLETE': {
      const updatedTasks = state.tasks.map(t => {
        if (t.id === action.payload.id) {
          const isDone = t.status === 'completed';
          return {
            ...t,
            status: (isDone ? 'inbox' : 'completed') as Task['status'],
            completedAt: isDone ? undefined : new Date().toISOString()
          };
        }
        return t;
      });

      const nextRec = getDoThisNowTask(updatedTasks, state.settings.userEnergy);

      return {
        ...state,
        tasks: updatedTasks,
        activeTaskId: nextRec ? nextRec.id : null
      };
    }

    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter(t => t.id !== action.payload.id);
      const nextRec = getDoThisNowTask(updatedTasks, state.settings.userEnergy);

      return {
        ...state,
        tasks: updatedTasks,
        activeTaskId: nextRec ? nextRec.id : null,
        isDetailDrawerOpen: state.detailDrawerTaskId === action.payload.id ? false : state.isDetailDrawerOpen
      };
    }

    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(t =>
        t.id === action.payload.task.id ? action.payload.task : t
      );
      return {
        ...state,
        tasks: updatedTasks
      };
    }

    case 'OPEN_AVOIDANCE_MODAL': {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      const dialogue = getAgentDialogue('ON_AVOIDANCE_DETECTED', state.agent.persona, task);

      return {
        ...state,
        isAvoidanceModalOpen: true,
        avoidanceModalTaskId: action.payload.taskId,
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote,
          lastEvent: 'ON_AVOIDANCE_DETECTED'
        }
      };
    }

    case 'CLOSE_AVOIDANCE_MODAL': {
      return {
        ...state,
        isAvoidanceModalOpen: false,
        avoidanceModalTaskId: null
      };
    }

    case 'APPLY_MICRO_STEPS': {
      const updatedTasks = state.tasks.map(t => {
        if (t.id === action.payload.taskId) {
          return {
            ...t,
            microSteps: action.payload.microSteps,
            isAvoided: false
          };
        }
        return t;
      });

      const selected = updatedTasks.find(t => t.id === action.payload.taskId);
      const dialogue = getAgentDialogue('ON_TASK_SELECT', state.agent.persona, selected);

      return {
        ...state,
        tasks: updatedTasks,
        isAvoidanceModalOpen: false,
        avoidanceModalTaskId: null,
        activeTaskId: action.payload.taskId,
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote
        }
      };
    }

    case 'TOGGLE_MICRO_STEP': {
      const updatedTasks = state.tasks.map(t => {
        if (t.id === action.payload.taskId) {
          const updatedSteps = t.microSteps.map(step =>
            step.id === action.payload.stepId
              ? { ...step, completed: !step.completed }
              : step
          );
          return { ...t, microSteps: updatedSteps };
        }
        return t;
      });

      return {
        ...state,
        tasks: updatedTasks
      };
    }

    case 'OPEN_DETAIL_DRAWER': {
      return {
        ...state,
        isDetailDrawerOpen: true,
        detailDrawerTaskId: action.payload.taskId
      };
    }

    case 'CLOSE_DETAIL_DRAWER': {
      return {
        ...state,
        isDetailDrawerOpen: false,
        detailDrawerTaskId: null
      };
    }

    case 'SET_PERSONA': {
      const newPersona = action.payload;
      const dialogue = getAgentDialogue('ON_INIT', newPersona);

      return {
        ...state,
        agent: {
          ...state.agent,
          persona: newPersona,
          currentMood: dialogue.mood,
          currentQuote: dialogue.quote
        },
        settings: {
          ...state.settings,
          defaultPersona: newPersona
        }
      };
    }

    case 'SET_USER_ENERGY': {
      const newEnergy = action.payload;
      const nextRec = getDoThisNowTask(state.tasks, newEnergy);

      return {
        ...state,
        activeTaskId: nextRec ? nextRec.id : state.activeTaskId,
        settings: {
          ...state.settings,
          userEnergy: newEnergy
        }
      };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        selectedFilter: action.payload
      };
    }

    case 'POKE_AGENT': {
      const banter = getRandomBanter(state.agent.persona, 0);
      return {
        ...state,
        agent: {
          ...state.agent,
          pokeCount: state.agent.pokeCount + 1,
          currentMood: banter.mood,
          currentQuote: banter.quote,
          lastEvent: 'ON_POKE'
        }
      };
    }

    case 'TOGGLE_SETTINGS': {
      return {
        ...state,
        isSettingsOpen: !state.isSettingsOpen
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    }

    case 'TOGGLE_CHAT_MODAL': {
      return {
        ...state,
        isChatModalOpen: !state.isChatModalOpen
      };
    }

    case 'OPEN_CHAT_MODAL': {
      return {
        ...state,
        isChatModalOpen: true
      };
    }

    case 'CLOSE_CHAT_MODAL': {
      return {
        ...state,
        isChatModalOpen: false
      };
    }

    case 'ADD_CHAT_MESSAGE': {
      const msg = action.payload;
      return {
        ...state,
        agent: {
          ...state.agent,
          currentMood: msg.mood || state.agent.currentMood,
          currentQuote: msg.sender === 'agent' ? msg.text : state.agent.currentQuote,
          chatHistory: [...(state.agent.chatHistory || []), msg]
        }
      };
    }

    case 'BATCH_ADD_TASKS': {
      const updatedTasks = [...action.payload, ...state.tasks];
      const nextRec = getDoThisNowTask(updatedTasks, state.settings.userEnergy);
      const dialogue = getAgentDialogue('ON_TASK_ADD', state.agent.persona, action.payload[0]);

      return {
        ...state,
        tasks: updatedTasks,
        activeTaskId: nextRec ? nextRec.id : state.activeTaskId,
        agent: {
          ...state.agent,
          currentMood: dialogue.mood,
          currentQuote: `Imported ${action.payload.length} tasks! Let's conquer the first one!`
        }
      };
    }

    case 'TOGGLE_BRAIN_DUMP': {
      return {
        ...state,
        isBrainDumpOpen: !state.isBrainDumpOpen
      };
    }

    case 'TOGGLE_DAILY_RECAP': {
      return {
        ...state,
        isDailyRecapOpen: !state.isDailyRecapOpen
      };
    }

    case 'TOGGLE_SYNC_MODAL': {
      return {
        ...state,
        isSyncModalOpen: !state.isSyncModalOpen
      };
    }

    case 'SET_AGENT_TALKING': {
      return {
        ...state,
        agent: {
          ...state.agent,
          isTalking: action.payload
        }
      };
    }

    case 'RESET_STATE': {
      return createInitialState();
    }

    case 'LOAD_SAVED_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}
