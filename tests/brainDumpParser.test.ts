import { describe, it, expect } from 'vitest';
import { parseBrainDumpToTasks } from '../src/core/brainDumpParser';

describe('brainDumpParser', () => {
  it('should parse multi-line brain dump into separate tasks', () => {
    const rawDump = `
      - Email Sarah about the lease renewal 15m #admin !high
      - Buy cat food and groceries @low
      - Fix critical login button bug 30m #dev !crit @high
    `;

    const tasks = parseBrainDumpToTasks(rawDump);
    expect(tasks.length).toBe(3);

    const task1 = tasks[0];
    expect(task1.title).toContain('Email Sarah about the lease renewal');
    expect(task1.estimatedMinutes).toBe(15);
    expect(task1.tags).toContain('admin');
    expect(task1.urgency).toBe('high');

    const task3 = tasks[2];
    expect(task3.title).toContain('Fix critical login button bug');
    expect(task3.estimatedMinutes).toBe(30);
    expect(task3.tags).toContain('dev');
    expect(task3.urgency).toBe('critical');
    expect(task3.energyLevel).toBe('high');
  });

  it('should handle comma or sentence-separated rambling text', () => {
    const rambling = "I need to call mom tomorrow, also finish the draft report 45m #work, and wash the dishes 10m";
    const tasks = parseBrainDumpToTasks(rambling);
    expect(tasks.length).toBeGreaterThanOrEqual(3);
  });

  it('should assign default values when metadata is omitted', () => {
    const simple = "Clean the garage";
    const tasks = parseBrainDumpToTasks(simple);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Clean the garage');
    expect(tasks[0].estimatedMinutes).toBe(25);
    expect(tasks[0].urgency).toBe('medium');
    expect(tasks[0].energyLevel).toBe('medium');
  });
});
