export type EnergyLevel = 'low' | 'medium' | 'high';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'inbox' | 'active' | 'in_progress' | 'completed' | 'abandoned';

export interface MicroStep {
  id: string;
  text: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  estimatedMinutes: number;
  energyLevel: EnergyLevel;
  urgency: UrgencyLevel;
  tags: string[];
  status: TaskStatus;
  
  // Avoidance & Stats Tracking
  snoozeCount: number;
  lastSnoozedAt?: string;
  createdAt: string;
  completedAt?: string;
  abandonCount: number;
  totalFocusMinutes: number;
  
  // Executive Dysfunction Micro-Decomposition
  microSteps: MicroStep[];
  isAvoided?: boolean;
}
