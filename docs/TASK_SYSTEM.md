# TASK_SYSTEM.md — Task Domain & Data Model

## 1. Task Data Schema

```typescript
export type EnergyLevel = 'low' | 'medium' | 'high';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'inbox' | 'active' | 'in_progress' | 'completed' | 'abandoned';

export interface MicroStep {
  id: string;
  text: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  estimatedMinutes: number; // Defaults to 25
  energyLevel: EnergyLevel; // Low (Zombie), Med (Normal), High (Beast mode)
  urgency: UrgencyLevel;
  tags: string[];
  status: TaskStatus;
  
  // Avoidance & Accountability Tracking
  snoozeCount: number;
  lastSnoozedAt?: string; // ISO string
  createdAt: string;      // ISO string
  completedAt?: string;   // ISO string
  abandonCount: number;
  totalFocusMinutes: number;
  
  // Micro-Step Breakdown for Executive Dysfunction
  microSteps: MicroStep[];
  isAvoided: boolean;
}
```

---

## 2. Quick Capture Syntax

The quick capture input parses inline shorthand syntax to minimize typing friction:

- `15m`, `30m`, `45m` $\rightarrow$ Sets `estimatedMinutes`
- `#tagname` $\rightarrow$ Adds to `tags` array
- `!low`, `!med`, `!high`, `!crit` $\rightarrow$ Sets `urgency`
- `@low`, `@med`, `@high` $\rightarrow$ Sets `energyLevel`

*Example:* `Draft marketing pitch 25m #launch !high @med` creates a 25-minute medium-energy task with `#launch` tag and `high` urgency.

---

## 3. Micro-Step Decomposition Model

When ADHD paralysis or task avoidance occurs, tasks are broken down into **2-minute atomic initiation micro-steps**:

1. *Open necessary app / document / tab.*
2. *Write single placeholder or title sentence.*
3. *Set timer and focus on the very first sentence.*

Completing micro-steps immediately lowers the barrier of resistance and builds momentum.
