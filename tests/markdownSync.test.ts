import { describe, it, expect } from 'vitest';
import { exportTasksToMarkdown, parseMarkdownToTasks } from '../src/core/markdownSync';
import { Task } from '../src/types';

describe('markdownSync', () => {
  const mockTasks: Task[] = [
    {
      id: 't1',
      title: 'Review PR for landing page',
      estimatedMinutes: 20,
      energyLevel: 'medium',
      urgency: 'high',
      tags: ['dev'],
      status: 'inbox',
      snoozeCount: 0,
      createdAt: new Date().toISOString(),
      abandonCount: 0,
      totalFocusMinutes: 0,
      microSteps: [
        { id: 'ms-1', text: 'Open github PR link', completed: false }
      ]
    },
    {
      id: 't2',
      title: 'Send invoice',
      estimatedMinutes: 10,
      energyLevel: 'low',
      urgency: 'medium',
      tags: ['money'],
      status: 'completed',
      snoozeCount: 0,
      createdAt: new Date().toISOString(),
      abandonCount: 0,
      totalFocusMinutes: 10,
      microSteps: []
    }
  ];

  it('should export tasks to readable Markdown format', () => {
    const md = exportTasksToMarkdown(mockTasks);
    expect(md).toContain('# NudgeBuddy Tasks');
    expect(md).toContain('- [ ] Review PR for landing page');
    expect(md).toContain('- [x] Send invoice');
    expect(md).toContain('#dev');
    expect(md).toContain('(20m)');
  });

  it('should parse markdown string back into Task objects', () => {
    const rawMd = `
# Tasks
- [ ] Buy groceries (15m) #home !low @low
- [x] Submit tax forms (30m) #finance !high
    `;

    const tasks = parseMarkdownToTasks(rawMd);
    expect(tasks.length).toBe(2);

    expect(tasks[0].title).toBe('Buy groceries');
    expect(tasks[0].status).toBe('inbox');
    expect(tasks[0].estimatedMinutes).toBe(15);
    expect(tasks[0].tags).toContain('home');

    expect(tasks[1].title).toBe('Submit tax forms');
    expect(tasks[1].status).toBe('completed');
    expect(tasks[1].estimatedMinutes).toBe(30);
  });
});
