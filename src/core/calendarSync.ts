import { Task } from '../types';

export function generateIcsForTask(task: Task, startDate: Date = new Date()): string {
  const durationMs = (task.estimatedMinutes || 25) * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dtStart = formatIcsDate(startDate);
  const dtEnd = formatIcsDate(endDate);
  const now = formatIcsDate(new Date());

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NudgeBuddy//ADHD Focus Companion//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:nudgebuddy-${task.id}@focus.app
DTSTAMP:${now}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:🎯 Focus: ${task.title.replace(/[,\n;]/g, ' ')}
DESCRIPTION:NudgeBuddy Focus Session (${task.estimatedMinutes}m)\\nUrgency: ${task.urgency}\\nEnergy: ${task.energyLevel}\\n${task.notes ? 'Notes: ' + task.notes.replace(/\n/g, '\\n') : ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

export function generateIcsForFocusDay(tasks: Task[]): string {
  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  let currentTime = new Date();
  // Start 5 minutes from now
  currentTime = new Date(currentTime.getTime() + 5 * 60 * 1000);

  let eventsStr = '';

  tasks.filter(t => t.status !== 'completed').forEach((task, idx) => {
    const durationMs = (task.estimatedMinutes || 25) * 60 * 1000;
    const dtStart = formatIcsDate(currentTime);
    const dtEnd = formatIcsDate(new Date(currentTime.getTime() + durationMs));

    eventsStr += `BEGIN:VEVENT
UID:nudgebuddy-${task.id}-${idx}@focus.app
DTSTAMP:${formatIcsDate(new Date())}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:🎯 Focus: ${task.title.replace(/[,\n;]/g, ' ')}
DESCRIPTION:NudgeBuddy Focus Sprint (${task.estimatedMinutes}m)
STATUS:CONFIRMED
END:VEVENT\n`;

    // 5-minute break buffer between sprints
    currentTime = new Date(currentTime.getTime() + durationMs + 5 * 60 * 1000);
  });

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NudgeBuddy//ADHD Focus Companion//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${eventsStr}END:VCALENDAR`;
}
