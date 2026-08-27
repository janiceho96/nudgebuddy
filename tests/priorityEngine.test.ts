import { describe, it, expect } from 'vitest';
import { calculateTaskScore, getDoThisNowTask } from '../src/core/priorityEngine';
import { Task, EnergyLevel } from '../src/types';

describe('priorityEngine', () => {
  const baseTask: Task = {
    id: '1',
    title: 'File quarterly taxes',
    estimatedMinutes: 25,
    energyLevel: 'medium',
    urgency: 'medium',
    tags: ['admin'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  };

  it('should score critical urgency higher than low urgency', () => {
    const lowTask = { ...baseTask, id: 'low', urgency: 'low' as const };
    const critTask = { ...baseTask, id: 'crit', urgency: 'critical' as const };

    const scoreLow = calculateTaskScore(lowTask, 'medium');
    const scoreCrit = calculateTaskScore(critTask, 'medium');

    expect(scoreCrit).toBeGreaterThan(scoreLow);
  });

  it('should give avoidance boost to tasks snoozed multiple times unless in cooldown', () => {
    const normalTask = { ...baseTask, id: 'normal', snoozeCount: 0 };
    // Snoozed 3 times, but more than 20 minutes ago (outside cooldown)
    const avoidedTask = {
      ...baseTask,
      id: 'avoided',
      snoozeCount: 3,
      lastSnoozedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    };

    const normalScore = calculateTaskScore(normalTask, 'medium');
    const avoidedScore = calculateTaskScore(avoidedTask, 'medium');

    expect(avoidedScore).toBeGreaterThan(normalScore);
  });

  it('should apply a temporary cooldown penalty if snoozed recently (under 15 min)', () => {
    const freshlySnoozedTask = {
      ...baseTask,
      id: 'fresh',
      snoozeCount: 2,
      lastSnoozedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    };

    const regularTask = { ...baseTask, id: 'reg', snoozeCount: 0 };

    const scoreFresh = calculateTaskScore(freshlySnoozedTask, 'medium');
    const scoreReg = calculateTaskScore(regularTask, 'medium');

    expect(scoreFresh).toBeLessThan(scoreReg);
  });

  it('should prioritize matching energy levels and penalize high-energy tasks when user is low energy', () => {
    const highEnergyTask = { ...baseTask, id: 'heavy', energyLevel: 'high' as const };
    const lowEnergyTask = { ...baseTask, id: 'light', energyLevel: 'low' as const };

    const scoreWhenZombie = calculateTaskScore(highEnergyTask, 'low');
    const scoreLightWhenZombie = calculateTaskScore(lowEnergyTask, 'low');

    expect(scoreLightWhenZombie).toBeGreaterThan(scoreWhenZombie);
  });

  it('should return the highest scored uncompleted task as "Do This Now"', () => {
    const tasks: Task[] = [
      { ...baseTask, id: '1', title: 'Casual read', urgency: 'low', energyLevel: 'low' },
      { ...baseTask, id: '2', title: 'URGENT Bugfix', urgency: 'critical', energyLevel: 'medium' },
      { ...baseTask, id: '3', title: 'Already done', urgency: 'critical', status: 'completed' }
    ];

    const recommended = getDoThisNowTask(tasks, 'medium');
    expect(recommended?.id).toBe('2');
  });

  it('should return null when all tasks are completed', () => {
    const tasks: Task[] = [
      { ...baseTask, id: '1', status: 'completed' }
    ];

    const recommended = getDoThisNowTask(tasks, 'medium');
    expect(recommended).toBeNull();
  });
});
