import { describe, it, expect } from 'vitest';
import { getDoThisNowTask } from '../src/core/priorityEngine';
import { parseBrainDumpToTasks } from '../src/core/brainDumpParser';
import { Task } from '../src/types';

describe('cliTools', () => {
  it('should parse command line task additions into structured tasks', () => {
    const rawArg = "Write blog post 20m #content !high @med";
    const tasks = parseBrainDumpToTasks(rawArg);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Write blog post');
    expect(tasks[0].estimatedMinutes).toBe(20);
    expect(tasks[0].tags).toContain('content');
    expect(tasks[0].urgency).toBe('high');
  });

  it('should pick top priority task for "budge now" command', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Low priority chore',
        estimatedMinutes: 10,
        energyLevel: 'low',
        urgency: 'low',
        tags: [],
        status: 'inbox',
        snoozeCount: 0,
        createdAt: new Date().toISOString(),
        abandonCount: 0,
        totalFocusMinutes: 0,
        microSteps: []
      },
      {
        id: '2',
        title: 'URGENT Prod Deploy',
        estimatedMinutes: 25,
        energyLevel: 'high',
        urgency: 'critical',
        tags: ['dev'],
        status: 'inbox',
        snoozeCount: 0,
        createdAt: new Date().toISOString(),
        abandonCount: 0,
        totalFocusMinutes: 0,
        microSteps: []
      }
    ];

    const recommended = getDoThisNowTask(tasks, 'medium');
    expect(recommended?.title).toBe('URGENT Prod Deploy');
  });
});
