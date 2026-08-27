import { Task } from '../types';

export const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design presentation slides for project milestone',
    notes: 'Draft key takeaways, flow diagrams, and summary insights.',
    estimatedMinutes: 25,
    energyLevel: 'medium',
    urgency: 'high',
    tags: ['work', 'presentation'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: [
      { id: 'ms-1', text: 'Open slide deck and write outline title', completed: false, estimatedMinutes: 2 },
      { id: 'ms-2', text: 'Add 3 bullet points summarizing main results', completed: false, estimatedMinutes: 5 },
      { id: 'ms-3', text: 'Review visual layout and styling', completed: false, estimatedMinutes: 5 }
    ]
  },
  {
    id: 'task-2',
    title: 'Review project research notes & outline next steps',
    notes: 'Organize research findings and synthesize action items.',
    estimatedMinutes: 20,
    energyLevel: 'high',
    urgency: 'medium',
    tags: ['research', 'strategy'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  },
  {
    id: 'task-3',
    title: 'Water home studio plants & open window for fresh air',
    notes: 'Gentle mindful reset and fresh breeze for energy.',
    estimatedMinutes: 5,
    energyLevel: 'low',
    urgency: 'low',
    tags: ['sanctuary', 'wellness'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  },
  {
    id: 'task-4',
    title: 'Organize desktop workspace & clear download folder',
    notes: 'Quick 10-minute tidy up to declutter headspace.',
    estimatedMinutes: 10,
    energyLevel: 'low',
    urgency: 'low',
    tags: ['tidy', 'momentum'],
    status: 'inbox',
    snoozeCount: 0,
    createdAt: new Date().toISOString(),
    abandonCount: 0,
    totalFocusMinutes: 0,
    microSteps: []
  }
];
