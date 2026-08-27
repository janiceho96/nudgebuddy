export type AgentPersona = 'gentle' | 'direct' | 'spicy';

export type AgentMood = 
  | 'idle' 
  | 'watching' 
  | 'hyped' 
  | 'judging' 
  | 'worried' 
  | 'celebrating' 
  | 'sleeping';

export type AgentTriggerEvent = 
  | 'ON_INIT'
  | 'ON_TASK_SELECT'
  | 'ON_FOCUS_START'
  | 'ON_FOCUS_PAUSE'
  | 'ON_FOCUS_RESUME'
  | 'ON_FOCUS_COMPLETE'
  | 'ON_FOCUS_GIVE_UP'
  | 'ON_SNOOZE'
  | 'ON_AVOIDANCE_DETECTED'
  | 'ON_TASK_ADD'
  | 'ON_POKE'
  | 'ON_CHAT';

export interface AgentDialogue {
  quote: string;
  mood: AgentMood;
  subtitle?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  mood?: AgentMood;
  suggestedSteps?: string[];
  actionType?: 'start_focus' | 'snooze' | 'apply_steps' | 'take_break';
}

export interface AgentState {
  name: string;
  persona: AgentPersona;
  currentMood: AgentMood;
  currentQuote: string;
  lastEvent?: AgentTriggerEvent;
  pokeCount: number;
  isTalking?: boolean;
  chatHistory: ChatMessage[];
}
