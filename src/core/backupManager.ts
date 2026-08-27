import { AppState } from './stateMachine';
import { Task } from '../types';

export function exportBackupJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importBackupJSON(jsonStr: string): AppState {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
    throw new Error('Invalid NudgeBuddy backup file format');
  }
  return parsed as AppState;
}

export function exportTasksToCSV(tasks: Task[]): string {
  const headers = ['ID', 'Title', 'Status', 'EstimatedMinutes', 'TotalFocusMinutes', 'Urgency', 'EnergyLevel', 'Tags', 'SnoozeCount', 'CreatedAt', 'CompletedAt'];
  
  const rows = tasks.map(t => [
    `"${t.id}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.status}"`,
    t.estimatedMinutes,
    t.totalFocusMinutes,
    `"${t.urgency}"`,
    `"${t.energyLevel}"`,
    `"${t.tags.join(';')}"`,
    t.snoozeCount,
    `"${t.createdAt}"`,
    `"${t.completedAt || ''}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadTextFile(filename: string, content: string, mimeType: string = 'text/plain') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
