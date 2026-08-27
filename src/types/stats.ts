export interface UserStats {
  completedCount: number;
  activeCount: number;
  totalFocusMinutes: number;
  todayCompletedCount: number;
  streakDays: number;
}

export interface DopamineBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
}
