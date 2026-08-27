import { Task, EnergyLevel, UrgencyLevel } from '../types';

export function parseBrainDumpToTasks(rawText: string): Task[] {
  if (!rawText || !rawText.trim()) return [];

  // Normalize delimiters (newlines, bullet points, numbered lists, or "and / also" sequences)
  const lines = rawText
    .split(/\n+/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const candidateChunks: string[] = [];

  for (const line of lines) {
    // If line starts with bullet/number, treat as individual item
    if (/^[-*•\d+.]\s+/.test(line)) {
      candidateChunks.push(line.replace(/^[-*•\d+.]\s+/, '').trim());
    } else if (line.includes(',') && line.length > 40) {
      // Split by comma if it looks like a list
      const subParts = line.split(/,\s*(?:also|and)?\s+/i);
      subParts.forEach(sp => {
        const clean = sp.replace(/^(?:also|and|need to|have to|must)\s+/i, '').trim();
        if (clean.length > 0) candidateChunks.push(clean);
      });
    } else {
      candidateChunks.push(line);
    }
  }

  return candidateChunks
    .map((chunk, idx) => parseSingleChunkToTask(chunk, idx))
    .filter(t => t.title.length > 0);
}

function parseSingleChunkToTask(chunk: string, index: number): Task {
  let text = chunk.trim();
  let estimatedMinutes = 25;
  const tags: string[] = [];
  let urgency: UrgencyLevel = 'medium';
  let energyLevel: EnergyLevel = 'medium';

  // 1. Time estimate e.g. 15m, 45min, 1h
  const timeMatch = text.match(/\b(\d+)\s*(m|min|mins|minutes|h|hr|hours)\b/i);
  if (timeMatch) {
    const val = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2].toLowerCase();
    estimatedMinutes = unit.startsWith('h') ? val * 60 : val;
    text = text.replace(timeMatch[0], '').trim();
  }

  // 2. Tags e.g. #admin, #work, #life
  const tagMatches = text.match(/#([\w-]+)/g);
  if (tagMatches) {
    tagMatches.forEach(t => {
      tags.push(t.replace('#', ''));
      text = text.replace(t, '').trim();
    });
  }

  // 3. Urgency e.g. !crit, !critical, !high, !low, !med
  if (/!(?:crit|critical)\b/i.test(text)) {
    urgency = 'critical';
    text = text.replace(/!(?:crit|critical)\b/i, '').trim();
  } else if (/!high\b/i.test(text)) {
    urgency = 'high';
    text = text.replace(/!high\b/i, '').trim();
  } else if (/!low\b/i.test(text)) {
    urgency = 'low';
    text = text.replace(/!low\b/i, '').trim();
  } else if (/!(?:med|medium)\b/i.test(text)) {
    urgency = 'medium';
    text = text.replace(/!(?:med|medium)\b/i, '').trim();
  }

  // 4. Energy level e.g. @low, @zombie, @high, @beast, @med
  if (/@(?:low|zombie)\b/i.test(text)) {
    energyLevel = 'low';
    text = text.replace(/@(?:low|zombie)\b/i, '').trim();
  } else if (/@(?:high|beast)\b/i.test(text)) {
    energyLevel = 'high';
    text = text.replace(/@(?:high|beast)\b/i, '').trim();
  } else if (/@(?:med|medium|normal)\b/i.test(text)) {
    energyLevel = 'medium';
    text = text.replace(/@(?:med|medium|normal)\b/i, '').trim();
  }

  // 5. Clean up leading "need to", "must", "todo:"
  text = text.replace(/^(?:todo|task|need to|have to|must|remember to):\s*/i, '').trim();
  text = text.replace(/^[-*•]\s*/, '').trim();

  // Auto tag inference if tags are empty
  const lower = text.toLowerCase();
  if (tags.length === 0) {
    if (lower.includes('email') || lower.includes('slack') || lower.includes('call') || lower.includes('message')) {
      tags.push('comms');
    } else if (lower.includes('bug') || lower.includes('code') || lower.includes('test') || lower.includes('pr') || lower.includes('deploy')) {
      tags.push('dev');
    } else if (lower.includes('buy') || lower.includes('clean') || lower.includes('groceries') || lower.includes('laundry')) {
      tags.push('life');
    } else if (lower.includes('tax') || lower.includes('invoice') || lower.includes('bill') || lower.includes('lease')) {
      tags.push('admin');
    }
  }

  return {
    id: `dump-${Date.now()}-${index}`,
    title: text || `Task ${index + 1}`,
    estimatedMinutes,
    energyLevel,
    urgency,
    tags,
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  };
}
