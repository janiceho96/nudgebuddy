import { describe, it, expect } from 'vitest';
import { generateIcsForTask, generateIcsForFocusDay } from '../src/core/calendarSync';
import { Task } from '../src/types';

describe('calendarSync', () => {
  const sampleTask: Task = {
    id: 't1',
    title: 'Write Technical Design Doc',
    notes: 'Focus sprint for tech spec',
    estimatedMinutes: 25,
    energyLevel: 'high',
    urgency: 'high',
    tags: ['work', 'spec'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  };

  it('should generate valid iCalendar (.ics) string for a task focus session', () => {
    const ics = generateIcsForTask(sampleTask);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('SUMMARY:🎯 Focus: Write Technical Design Doc');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('should generate full day batch .ics for all active tasks', () => {
    const tasks = [sampleTask, { ...sampleTask, id: 't2', title: 'Code Review' }];
    const ics = generateIcsForFocusDay(tasks);
    expect(ics).toContain('SUMMARY:🎯 Focus: Write Technical Design Doc');
    expect(ics).toContain('SUMMARY:🎯 Focus: Code Review');
  });
});
