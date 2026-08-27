export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface FocusSession {
  taskId: string;
  totalDurationSeconds: number; // Defaults to 1500 (25 min)
  remainingSeconds: number;
  status: TimerStatus;
  startedAt?: string;
  pausedAt?: string;
  extendedCount: number;
}
