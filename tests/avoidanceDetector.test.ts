import { describe, it, expect } from 'vitest';
import { checkAvoidance, generateMicroStepsForTask } from '../src/core/avoidanceDetector';
import { Task } from '../src/types';

describe('avoidanceDetector', () => {
  const baseTask: Task = {
    id: 't1',
    title: 'Write project quarterly review',
    estimatedMinutes: 45,
    energyLevel: 'high',
    urgency: 'high',
    tags: ['work', 'docs'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  };

  it('should not flag avoidance for fresh tasks', () => {
    const result = checkAvoidance(baseTask);
    expect(result.isAvoided).toBe(false);
    expect(result.reason).toBeNull();
  });

  it('should flag avoidance when snoozeCount >= 2', () => {
    const snoozedTask = { ...baseTask, snoozeCount: 2 };
    const result = checkAvoidance(snoozedTask);
    expect(result.isAvoided).toBe(true);
    expect(result.reason).toContain('snoozed 2 times');
  });

  it('should flag avoidance when task has been abandoned during focus sessions', () => {
    const abandonedTask = { ...baseTask, abandonCount: 2, totalFocusMinutes: 2 };
    const result = checkAvoidance(abandonedTask);
    expect(result.isAvoided).toBe(true);
    expect(result.reason).toContain('abandoned');
  });

  it('should generate 3 atomic initiation micro-steps for a task', () => {
    const steps = generateMicroStepsForTask(baseTask);
    expect(steps.length).toBeGreaterThanOrEqual(3);
    expect(steps[0].text).toContain('Open');
    expect(steps[1].text.length).toBeGreaterThan(5);
    expect(steps.every(s => s.completed === false)).toBe(true);
  });
});
