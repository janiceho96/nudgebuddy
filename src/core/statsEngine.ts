import { Task } from '../types';

export interface DopamineBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
}

export interface UserStats {
  completedCount: number;
  activeCount: number;
  totalFocusMinutes: number;
  todayCompletedCount: number;
  streakDays: number;
}

export function calculateUserStats(tasks: Task[]): UserStats {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  const totalFocusMinutes = tasks.reduce((sum, t) => sum + (t.totalFocusMinutes || 0), 0);

  // Check tasks completed today (within last 24h)
  const now = Date.now();
  const todayCompleted = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const completedTime = new Date(t.completedAt).getTime();
    return (now - completedTime) < (24 * 60 * 60 * 1000);
  });

  return {
    completedCount: completedTasks.length,
    activeCount: activeTasks.length,
    totalFocusMinutes,
    todayCompletedCount: todayCompleted.length,
    streakDays: completedTasks.length > 0 ? Math.min(completedTasks.length, 5) : 0
  };
}

export function getDopamineBadges(tasks: Task[]): DopamineBadge[] {
  const stats = calculateUserStats(tasks);
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const overcameSnooze = completedTasks.some(t => t.snoozeCount >= 2);
  const didLongFocus = tasks.some(t => t.totalFocusMinutes >= 25);
  const didQuickWin = completedTasks.some(t => t.estimatedMinutes <= 10);
  const inboxZero = tasks.length > 0 && stats.activeCount === 0;

  return [
    {
      id: 'momentum_starter',
      name: 'Momentum Spark',
      emoji: '⚡',
      description: 'Completed your very first focus task!',
      unlocked: stats.completedCount >= 1
    },
    {
      id: 'snooze_buster',
      name: 'Snooze Buster',
      emoji: '🥊',
      description: 'Defeated resistance on a task snoozed 2+ times!',
      unlocked: overcameSnooze
    },
    {
      id: 'deep_diver',
      name: 'Deep Diver',
      emoji: '🤿',
      description: 'Banked a full 25+ minute hyper-focus session!',
      unlocked: didLongFocus
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      emoji: '🏎️',
      description: 'Crushed a quick 10-minute micro-task!',
      unlocked: didQuickWin
    },
    {
      id: 'clean_slate',
      name: 'Inbox Zero Hero',
      emoji: '👑',
      description: 'Completed every single active task on your plate!',
      unlocked: inboxZero
    }
  ];
}
