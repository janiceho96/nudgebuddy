import { describe, it, expect } from 'vitest';
import { appReducer, createInitialState } from '../src/core/stateMachine';
import { AppState } from '../src/core/stateMachine';

describe('stateMachine', () => {
  it('should initialize with sensible defaults and mock tasks', () => {
    const state = createInitialState();
    expect(state.tasks.length).toBeGreaterThan(0);
    expect(state.agent.name).toBe('Budge');
    expect(state.timer.status).toBe('idle');
    expect(state.timer.remainingSeconds).toBe(1500); // 25 minutes
  });

  it('should handle ADD_TASK and update agent dialogue', () => {
    const state = createInitialState();
    const nextState = appReducer(state, {
      type: 'ADD_TASK',
      payload: {
        title: 'Draft slides 15m #work !high',
        estimatedMinutes: 15,
        tags: ['work'],
        urgency: 'high',
        energyLevel: 'medium'
      }
    });

    expect(nextState.tasks.length).toBe(state.tasks.length + 1);
    expect(nextState.tasks[0].title).toContain('Draft slides');
    expect(nextState.agent.lastEvent).toBe('ON_TASK_ADD');
  });

  it('should handle START_FOCUS and transition timer to running', () => {
    const state = createInitialState();
    const task = state.tasks[0];

    const nextState = appReducer(state, {
      type: 'START_FOCUS',
      payload: { taskId: task.id }
    });

    expect(nextState.timer.status).toBe('running');
    expect(nextState.timer.taskId).toBe(task.id);
    expect(nextState.agent.currentMood).toBe('watching');
  });

  it('should handle PAUSE_FOCUS and RESUME_FOCUS', () => {
    let state = createInitialState();
    state = appReducer(state, { type: 'START_FOCUS', payload: { taskId: state.tasks[0].id } });
    
    state = appReducer(state, { type: 'PAUSE_FOCUS' });
    expect(state.timer.status).toBe('paused');

    state = appReducer(state, { type: 'RESUME_FOCUS' });
    expect(state.timer.status).toBe('running');
  });

  it('should handle EXTEND_TIMER (+5 minutes)', () => {
    let state = createInitialState();
    state = appReducer(state, { type: 'START_FOCUS', payload: { taskId: state.tasks[0].id } });
    const initialRemaining = state.timer.remainingSeconds;

    state = appReducer(state, { type: 'EXTEND_TIMER' });
    expect(state.timer.remainingSeconds).toBe(initialRemaining + 300);
    expect(state.timer.extendedCount).toBe(1);
  });

  it('should handle SNOOZE_TASK and trigger avoidance modal if snoozed >= 2 times', () => {
    let state = createInitialState();
    const task = state.tasks.find(t => t.snoozeCount === 0) || state.tasks[0];
    task.snoozeCount = 0;

    // First snooze
    state = appReducer(state, { type: 'SNOOZE_TASK', payload: { id: task.id } });
    let updatedTask = state.tasks.find(t => t.id === task.id);
    expect(updatedTask?.snoozeCount).toBe(1);
    expect(state.isAvoidanceModalOpen).toBe(false);

    // Second snooze
    state = appReducer(state, { type: 'SNOOZE_TASK', payload: { id: task.id } });
    updatedTask = state.tasks.find(t => t.id === task.id);
    expect(updatedTask?.snoozeCount).toBe(2);
    expect(state.isAvoidanceModalOpen).toBe(true);
    expect(state.agent.currentMood).toBe('worried');
  });

  it('should handle COMPLETE_FOCUS and mark task completed', () => {
    let state = createInitialState();
    const task = state.tasks[0];
    state = appReducer(state, { type: 'START_FOCUS', payload: { taskId: task.id } });

    state = appReducer(state, { type: 'COMPLETE_FOCUS' });
    expect(state.timer.status).toBe('completed');
    const completedTask = state.tasks.find(t => t.id === task.id);
    expect(completedTask?.status).toBe('completed');
    expect(state.agent.currentMood).toBe('celebrating');
  });

  it('should switch persona and update dialogue tone', () => {
    let state = createInitialState();
    state = appReducer(state, { type: 'SET_PERSONA', payload: 'spicy' });
    expect(state.agent.persona).toBe('spicy');
    expect(state.settings.defaultPersona).toBe('spicy');
  });
});
