import { Task } from '../types';

export const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Reply to landlord email about lease renewal',
    notes: 'Need to ask about the parking spot fee and confirm 12-month extension.',
    estimatedMinutes: 15,
    energyLevel: 'low',
    urgency: 'high',
    tags: ['admin', 'life'],
    status: 'inbox',
    snoozeCount: 1,
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: [
      { id: 'ms-1', text: 'Open email client and find thread from Landlord', completed: false, estimatedMinutes: 2 },
      { id: 'ms-2', text: 'Draft 2 sentences confirming renewal dates', completed: false, estimatedMinutes: 5 },
      { id: 'ms-3', text: 'Review and click Send', completed: false, estimatedMinutes: 2 }
    ]
  },
  {
    id: 'task-2',
    title: 'Review Q3 Engineering Roadmap draft',
    notes: 'Check timeline feasibility and highlight any missing dependencies.',
    estimatedMinutes: 25,
    energyLevel: 'high',
    urgency: 'critical',
    tags: ['work', 'strategy'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  },
  {
    id: 'task-3',
    title: 'Cancel gym membership free trial subscription',
    notes: 'Log in to gym portal -> settings -> billing -> cancel.',
    estimatedMinutes: 10,
    energyLevel: 'low',
    urgency: 'high',
    tags: ['money'],
    status: 'inbox',
    snoozeCount: 2,
    lastSnoozedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    abandonCount: 1,
    totalFocusMinutes: 2,
    isAvoided: true,
    microSteps: [
      { id: 'ms-3-1', text: 'Open browser and go to gym account login page', completed: false, estimatedMinutes: 2 },
      { id: 'ms-3-2', text: 'Navigate to Subscription Settings', completed: false, estimatedMinutes: 3 },
      { id: 'ms-3-3', text: 'Click Cancel Membership and confirm', completed: false, estimatedMinutes: 2 }
    ]
  },
  {
    id: 'task-4',
    title: 'Clean desk coffee mugs & wipe keyboard',
    notes: 'Quick desk reset for dopamine momentum.',
    estimatedMinutes: 10,
    energyLevel: 'low',
    urgency: 'low',
    tags: ['reset', 'home'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  }
];
