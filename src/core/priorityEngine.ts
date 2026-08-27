import { Task, EnergyLevel } from '../types';

export function calculateTaskScore(task: Task, userEnergy: EnergyLevel = 'medium'): number {
  if (task.status === 'completed') {
    return -9999;
  }

  let score = 0;

  // 1. Urgency Base Score
  switch (task.urgency) {
    case 'critical':
      score += 100;
      break;
    case 'high':
      score += 60;
      break;
    case 'medium':
      score += 30;
      break;
    case 'low':
      score += 10;
      break;
  }

  // 2. User Energy Alignment
  if (userEnergy === 'low') {
    if (task.energyLevel === 'low') {
      score += 30; // Great for low-dopamine moments
    } else if (task.energyLevel === 'high') {
      score -= 40; // Avoid cognitive paralysis when exhausted
    }
  } else if (userEnergy === 'high') {
    if (task.energyLevel === 'high') {
      score += 35; // Tackle beast tasks while energized
    } else if (task.energyLevel === 'low') {
      score += 5;
    }
  } else {
    // Medium energy
    if (task.energyLevel === 'medium') score += 20;
  }

  // 3. Avoidance Penalty / Escalation
  if (task.snoozeCount === 1) {
    score += 15;
  } else if (task.snoozeCount >= 2) {
    score += 45; // Escalate avoided tasks
  }

  if (task.abandonCount >= 1) {
    score += 20;
  }

  // 4. Snooze Cooldown Check (if snoozed in the last 15 minutes, down-rank)
  if (task.lastSnoozedAt) {
    const lastSnoozeTime = new Date(task.lastSnoozedAt).getTime();
    const now = Date.now();
    const minutesSinceSnooze = (now - lastSnoozeTime) / (1000 * 60);

    if (minutesSinceSnooze < 15) {
      score -= 80; // Provide short cooling-off buffer
    }
  }

  // 5. Quick-Win Momentum Bonus (<= 15 minutes)
  if (task.estimatedMinutes <= 15) {
    score += 15;
  }

  return score;
}

export function getDoThisNowTask(tasks: Task[], userEnergy: EnergyLevel = 'medium'): Task | null {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  if (pendingTasks.length === 0) return null;

  const scoredTasks = pendingTasks.map((task) => ({
    task,
    score: calculateTaskScore(task, userEnergy)
  }));

  scoredTasks.sort((a, b) => b.score - a.score);

  return scoredTasks[0]?.task ?? null;
}
