import { describe, it, expect } from 'vitest';
import { getAgentDialogue, getRandomBanter } from '../src/core/agentDialogueEngine';
import { Task } from '../src/types';

describe('agentDialogueEngine', () => {
  const sampleTask: Task = {
    id: 't1',
    title: 'Clean the kitchen sink',
    estimatedMinutes: 15,
    energyLevel: 'low',
    urgency: 'medium',
    tags: ['home'],
    status: 'active',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  };

  it('should return gentle commentary for gentle persona on focus start', () => {
    const dialogue = getAgentDialogue('ON_FOCUS_START', 'gentle', sampleTask);
    expect(dialogue.mood).toBe('watching');
    expect(dialogue.quote.length).toBeGreaterThan(10);
  });

  it('should return empathetic response on multiple snoozes', () => {
    const snoozedTask = { ...sampleTask, snoozeCount: 3 };
    const dialogue = getAgentDialogue('ON_SNOOZE', 'spicy', snoozedTask);
    expect(dialogue.mood).toBe('worried');
    expect(dialogue.quote.toLowerCase()).toMatch(/friction|break down|tiny|ready|snooze/);
  });

  it('should return direct coach prompt on avoidance intervention', () => {
    const dialogue = getAgentDialogue('ON_AVOIDANCE_DETECTED', 'direct', sampleTask);
    expect(dialogue.mood).toBe('worried');
    expect(dialogue.quote).toContain('2 minutes');
  });

  it('should return celebration quote with celebratory mood on focus complete', () => {
    const dialogue = getAgentDialogue('ON_FOCUS_COMPLETE', 'gentle', sampleTask);
    expect(dialogue.mood).toBe('celebrating');
  });

  it('should return random banter when mascot is poked', () => {
    const dialogue = getRandomBanter('spicy', 2);
    expect(dialogue.quote.length).toBeGreaterThan(5);
  });
});
