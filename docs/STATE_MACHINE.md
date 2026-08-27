# STATE_MACHINE.md — App Finite State Machine

## 1. States

- `IDLE`: Default state with no active timer. Mascot in observation/chill mode.
- `TASK_SELECTED`: User clicked or highlighted a task from the list.
- `FOCUSING`: 25-minute Pomodoro timer running. UI locks down non-essential controls.
- `FOCUS_PAUSED`: Timer temporarily halted. Mascot looks inquisitive/suspicious.
- `FOCUS_COMPLETED`: 25-minute session concluded successfully. Celebration triggered.
- `AVOIDANCE_INTERVENTION`: Avoidance popup modal active with micro-step breakdown wizard.
- `TASK_DETAIL_OPEN`: Detail drawer open for editing notes and subtasks.

---

## 2. State Transition Diagram

```
                 +--------------------------+
                 |           IDLE           |
                 +--------------------------+
                    |          ^         ^
      SELECT_TASK   |          | SNOOZE  | COMPLETE_TASK
                    v          |         |
          +-------------------+          |
          |   TASK_SELECTED   |          |
          +-------------------+          |
                    |                    |
        START_FOCUS |                    |
                    v                    |
          +-------------------+          |
          |     FOCUSING      | ---------+ (FINISH)
          +-------------------+
             | |           ^
   PAUSE_REQ | | RESUME    |
             v |           |
    +---------------+      |
    | FOCUS_PAUSED  | -----+
    +---------------+
             |
             | GIVE_UP / SNOOZE >= 2
             v
    +------------------------------+
    |    AVOIDANCE_INTERVENTION    |
    +------------------------------+
```

---

## 3. Events & Actions Table

| Current State | Event | Next State | Action / Side Effects |
| :--- | :--- | :--- | :--- |
| `IDLE` | `SELECT_TASK` | `TASK_SELECTED` | Sets `selectedTaskId`, updates agent dialogue |
| `TASK_SELECTED` | `START_FOCUS` | `FOCUSING` | Sets `timer.status = 'running'`, mascot = `'watching'` |
| `FOCUSING` | `PAUSE_FOCUS` | `FOCUS_PAUSED` | Halts interval, mascot = `'judging'` or `'worried'` |
| `FOCUS_PAUSED` | `RESUME_FOCUS` | `FOCUSING` | Resumes interval, mascot = `'watching'` |
| `FOCUSING` | `COMPLETE_TASK` | `FOCUS_COMPLETED` | Confetti explosion, updates task to `completed` |
| `FOCUSING` | `GIVE_UP` | `IDLE` | Increments `abandonCount`, checks avoidance |
| `TASK_SELECTED` | `SNOOZE_TASK` | `IDLE` | Increments `snoozeCount`, if $\ge 2 \rightarrow$ `AVOIDANCE_INTERVENTION` |
| `AVOIDANCE_INTERVENTION` | `APPLY_MICRO_STEPS` | `FOCUSING` | Replaces/appends micro-steps, starts 25m focus |
