import { AgentPersona, EnergyLevel } from './index';

export type ProactivityLevel = 'low' | 'balanced' | 'high';
export type HoverHideMode = 'none' | 'bottom_dock' | 'edge_drawer' | 'peek_dock' | 'ghost_dim';

export interface AppSettings {
  defaultPersona: AgentPersona;
  proactivity: ProactivityLevel;
  userEnergy: EnergyLevel;
  focusDurationMinutes: number; // Defaults to 25
  soundEnabled: boolean;
  voiceEnabled: boolean;
  compactMode: boolean;
  hoverHideMode: HoverHideMode; // Hover-to-reveal mode
  geminiApiKey?: string;
}
