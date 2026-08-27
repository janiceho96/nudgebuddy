import { describe, it, expect } from 'vitest';
import { calculateUserStats, getDopamineBadges } from '../src/core/statsEngine';
import { Task } from '../src/types';

describe('statsEngine', () => {
  const mockTasks: Task[] = [
    {
      id: 't1',
      title: 'Task 1',
      estimatedMinutes: 25,
      energyLevel: 'medium',
      urgency: 'high',
      tags: ['work'],
      status: 'completed',
      snoozeCount: 0,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      abandonCount: 0,
      totalFocusMinutes: 25,
      microSteps: []
    },
    {
      id: 't2',
      title: 'Task 2',
      estimatedMinutes: 15,
      energyLevel: 'low',
      urgency: 'medium',
      tags: ['life'],
      status: 'completed',
      snoozeCount: 2, // Overcame avoidance!
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      abandonCount: 0,
      totalFocusMinutes: 15,
      microSteps: []
    },
    {
      id: 't3',
      title: 'Task 3',
      estimatedMinutes: 30,
      energyLevel: 'high',
      urgency: 'critical',
      tags: ['work'],
      status: 'inbox',
      snoozeCount: 0,
      createdAt: new Date().toISOString(),
      abandonCount: 0,
      totalFocusMinutes: 10,
      microSteps: []
    }
  ];

  it('should compute total completed tasks and total focus minutes', () => {
    const stats = calculateUserStats(mockTasks);
    expect(stats.completedCount).toBe(2);
    expect(stats.activeCount).toBe(1);
    expect(stats.totalFocusMinutes).toBe(50); // 25 + 15 + 10
  });

  it('should award Snooze Buster badge when user completes a task that was snoozed >= 2 times', () => {
    const badges = getDopamineBadges(mockTasks);
    const snoozeBadge = badges.find(b => b.id === 'snooze_buster');
    expect(snoozeBadge).toBeDefined();
    expect(snoozeBadge?.unlocked).toBe(true);
  });

  it('should award Momentum Starter badge when at least 1 task is completed', () => {
    const badges = getDopamineBadges(mockTasks);
    const firstTaskBadge = badges.find(b => b.id === 'momentum_starter');
    expect(firstTaskBadge?.unlocked).toBe(true);
  });
});
