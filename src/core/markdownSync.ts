import { Task, EnergyLevel, UrgencyLevel } from '../types';

export function exportTasksToMarkdown(tasks: Task[]): string {
  const active = tasks.filter(t => t.status !== 'completed');
  const completed = tasks.filter(t => t.status === 'completed');

  let out = '# NudgeBuddy Tasks\n\n## 🎯 Active Tasks\n';

  if (active.length === 0) {
    out += '_No active tasks. Inbox Zero!_\n';
  } else {
    active.forEach(t => {
      const tagsStr = t.tags.length > 0 ? t.tags.map(tag => `#${tag}`).join(' ') + ' ' : '';
      const urgencyStr = `!${t.urgency} `;
      const energyStr = `@${t.energyLevel} `;
      const timeStr = `(${t.estimatedMinutes}m) `;
      out += `- [ ] ${t.title} ${timeStr}${tagsStr}${urgencyStr}${energyStr}\n`;
      if (t.notes) {
        out += `  > ${t.notes}\n`;
      }
      if (t.microSteps && t.microSteps.length > 0) {
        t.microSteps.forEach(ms => {
          out += `  - [${ms.completed ? 'x' : ' '}] ${ms.text}\n`;
        });
      }
    });
  }

  out += '\n## ✅ Completed Tasks\n';
  if (completed.length === 0) {
    out += '_No completed tasks yet._\n';
  } else {
    completed.forEach(t => {
      out += `- [x] ${t.title} (${t.estimatedMinutes}m)\n`;
    });
  }

  return out;
}

export function parseMarkdownToTasks(markdown: string): Task[] {
  const lines = markdown.split(/\n+/);
  const tasks: Task[] = [];
  let currentTask: Task | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Check for task checklist line: - [ ] or - [x]
    const taskMatch = rawLine.match(/^-\s*\[([ xX])\]\s*(.+)$/);
    if (taskMatch) {
      if (currentTask) tasks.push(currentTask);

      const isCompleted = taskMatch[1].toLowerCase() === 'x';
      let titleContent = taskMatch[2].trim();
      let estimatedMinutes = 25;
      const tags: string[] = [];
      let urgency: UrgencyLevel = 'medium';
      let energyLevel: EnergyLevel = 'medium';

      // Time (e.g. (15m) or (45min))
      const timeMatch = titleContent.match(/\((\d+)\s*(?:m|min|mins|h|hr)?\)/i);
      if (timeMatch) {
        estimatedMinutes = parseInt(timeMatch[1], 10);
        titleContent = titleContent.replace(timeMatch[0], '').trim();
      }

      // Tags
      const tagMatches = titleContent.match(/#([\w-]+)/g);
      if (tagMatches) {
        tagMatches.forEach(t => {
          tags.push(t.replace('#', ''));
          titleContent = titleContent.replace(t, '').trim();
        });
      }

      // Urgency
      if (/!crit(?:ical)?/i.test(titleContent)) {
        urgency = 'critical';
        titleContent = titleContent.replace(/!crit(?:ical)?/i, '').trim();
      } else if (/!high/i.test(titleContent)) {
        urgency = 'high';
        titleContent = titleContent.replace(/!high/i, '').trim();
      } else if (/!low/i.test(titleContent)) {
        urgency = 'low';
        titleContent = titleContent.replace(/!low/i, '').trim();
      } else if (/!med(?:ium)?/i.test(titleContent)) {
        urgency = 'medium';
        titleContent = titleContent.replace(/!med(?:ium)?/i, '').trim();
      }

      // Energy
      if (/@(?:low|zombie)/i.test(titleContent)) {
        energyLevel = 'low';
        titleContent = titleContent.replace(/@(?:low|zombie)/i, '').trim();
      } else if (/@(?:high|beast)/i.test(titleContent)) {
        energyLevel = 'high';
        titleContent = titleContent.replace(/@(?:high|beast)/i, '').trim();
      }

      currentTask = {
        id: `md-${Date.now()}-${tasks.length}`,
        title: titleContent || 'Untitled Task',
        estimatedMinutes,
        energyLevel,
        urgency,
        tags,
        status: isCompleted ? 'completed' : 'inbox',
        snoozeCount: 0,
        createdAt: new Date().toISOString(),
        completedAt: isCompleted ? new Date().toISOString() : undefined,
        abandonCount: 0,
        totalFocusMinutes: isCompleted ? estimatedMinutes : 0,
        microSteps: []
      };
    } else if (rawLine.startsWith('>') && currentTask) {
      // Notes line
      currentTask.notes = rawLine.replace(/^>\s*/, '').trim();
    } else if (rawLine.match(/^-\s*\[([ xX])\]\s*(.+)$/) && currentTask) {
      // Subtask
      const isSubDone = rawLine.includes('[x]') || rawLine.includes('[X]');
      const subText = rawLine.replace(/^-\s*\[[ xX]\]\s*/, '').trim();
      currentTask.microSteps.push({
        id: `ms-${Date.now()}-${currentTask.microSteps.length}`,
        text: subText,
        completed: isSubDone
      });
    }
  }

  if (currentTask) tasks.push(currentTask);

  return tasks;
}
