import { Task, MicroStep } from '../types';

export interface AvoidanceResult {
  isAvoided: boolean;
  reason: string | null;
  severity: 'mild' | 'moderate' | 'high';
}

export function checkAvoidance(task: Task): AvoidanceResult {
  if (task.status === 'completed') {
    return { isAvoided: false, reason: null, severity: 'mild' };
  }

  // 1. Repeated Snoozes
  if (task.snoozeCount >= 3) {
    return {
      isAvoided: true,
      reason: `Task has been snoozed ${task.snoozeCount} times. Executive dysfunction detected!`,
      severity: 'high'
    };
  }

  if (task.snoozeCount >= 2) {
    return {
      isAvoided: true,
      reason: `Task has been snoozed 2 times. The resistance barrier is high.`,
      severity: 'moderate'
    };
  }

  // 2. Abandoned focus sessions
  if (task.abandonCount >= 2) {
    return {
      isAvoided: true,
      reason: `Task was abandoned ${task.abandonCount} times during focus sessions. Let's make it smaller.`,
      severity: 'high'
    };
  }

  if (task.abandonCount === 1 && task.totalFocusMinutes < 5) {
    return {
      isAvoided: true,
      reason: `Task was started but stopped after just ${task.totalFocusMinutes}m. Initiation friction detected.`,
      severity: 'moderate'
    };
  }

  // 3. Stale high priority task (created > 24 hours ago, no progress)
  const createdTime = new Date(task.createdAt).getTime();
  const hoursSinceCreation = (Date.now() - createdTime) / (1000 * 60 * 60);

  if (hoursSinceCreation > 24 && (task.urgency === 'high' || task.urgency === 'critical') && task.totalFocusMinutes === 0) {
    return {
      isAvoided: true,
      reason: `High urgency task sitting untouched for over 24 hours.`,
      severity: 'moderate'
    };
  }

  return { isAvoided: false, reason: null, severity: 'mild' };
}

export function generateMicroStepsForTask(task: Task): MicroStep[] {
  const title = task.title.trim();
  const lower = title.toLowerCase();

  let firstStep = `Open the tab, file, or workspace for "${title}"`;
  let secondStep = `Write down 1 sloppy bullet point or outline note`;
  let thirdStep = `Focus for just 2 minutes without judging the quality`;

  if (lower.includes('email') || lower.includes('message') || lower.includes('reply') || lower.includes('slack')) {
    firstStep = 'Open your email/messaging app and click Reply';
    secondStep = 'Type a raw 1-sentence draft (do not edit yet)';
    thirdStep = 'Add greeting, proofread quickly, and hit Send';
  } else if (lower.includes('write') || lower.includes('draft') || lower.includes('doc') || lower.includes('report') || lower.includes('review')) {
    firstStep = `Open/create the document for "${title}" and add a title heading`;
    secondStep = 'Write 3 ugly bullet points of what must be said';
    thirdStep = 'Expand just the very first bullet point into 2 sentences';
  } else if (lower.includes('clean') || lower.includes('organize') || lower.includes('room') || lower.includes('desk') || lower.includes('sink')) {
    firstStep = 'Stand up and pick up exactly 3 items to put away';
    secondStep = 'Wipe or clear one single surface area';
    thirdStep = 'Throw away obvious trash in sight';
  } else if (lower.includes('code') || lower.includes('bug') || lower.includes('fix') || lower.includes('feature') || lower.includes('test')) {
    firstStep = 'Open project in editor and locate relevant file';
    secondStep = 'Add a failing test or single console.log breakpoint';
    thirdStep = 'Write minimal 3 lines of code to test the hypothesis';
  } else if (lower.includes('read') || lower.includes('study') || lower.includes('book') || lower.includes('article')) {
    firstStep = 'Open the reading material and skim the headings for 60 seconds';
    secondStep = 'Read just the first 2 paragraphs';
    thirdStep = 'Highlight or jot down 1 key takeaway';
  }

  return [
    { id: `${Date.now()}-1`, text: firstStep, completed: false, estimatedMinutes: 2 },
    { id: `${Date.now()}-2`, text: secondStep, completed: false, estimatedMinutes: 5 },
    { id: `${Date.now()}-3`, text: thirdStep, completed: false, estimatedMinutes: 10 }
  ];
}
