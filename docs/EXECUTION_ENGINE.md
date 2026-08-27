# EXECUTION_ENGINE.md — Priority & Avoidance Engine

## 1. "Do This Now" Priority Algorithm

To eliminate decision fatigue for ADHD users, the app recommends exactly **ONE** task at any given time.

### Formula:
$$\text{PriorityScore} = S_{\text{urgency}} + S_{\text{energy}} + S_{\text{avoidance}} - S_{\text{durationPenalty}} - S_{\text{snoozeCooldown}}$$

### Score Weight Table:

1. **Urgency Base Score ($S_{\text{urgency}}$)**:
   - `critical`: $+100$
   - `high`: $+60$
   - `medium`: $+30$
   - `low`: $+10$

2. **Energy Match ($S_{\text{energy}}$)**:
   - User Energy $\equiv$ Task Energy: $+25$
   - User Energy is `low` and Task is `high`: $-40$ (Avoids burnout paralysis)
   - User Energy is `high` and Task is `high`: $+35$ (Leverages hyper-focus window)

3. **Avoidance Boost ($S_{\text{avoidance}}$)**:
   - `snoozeCount == 1`: $+10$
   - `snoozeCount >= 2`: $+45$ (Pushes avoided tasks back into spotlight before they rot)

4. **Snooze Cooldown ($S_{\text{snoozeCooldown}}$)**:
   - If snoozed in the last 15 minutes: $-80$ (Gives temporary breathing room if intentionally deferred).

5. **Quick-Win Duration Preference**:
   - Estimated $\le 15$ min: $+15$ bonus for dopamine momentum.

---

## 2. Avoidance Detection Engine

Avoidance is flagged when any of the following conditions trigger:
1. **Repeated Snoozes**: `snoozeCount >= 2`.
2. **Abandoned Focus Sessions**: `abandonCount >= 1` and `totalFocusMinutes < 5`.
3. **Stale High-Priority Task**: Task created $> 24$ hours ago with `urgency >= 'high'` but $0$ focus time.

When triggered, the state machine transitions to `AVOIDANCE_INTERVENTION`, prompting Budge to step in with the 2-minute micro-breakdown wizard.

---

## 3. 25-Minute Focus Execution Loop

1. **Start**: Resets countdown to `25:00` (1500s), locks UI focus to single task, sets Budge to `watching`.
2. **Tick**: Increments `totalFocusMinutes` and updates circular SVG progress meter.
3. **+5m Panic Extension**: Adds 300 seconds if the user is in flow and wants to wrap up cleanly.
4. **Completion**: Confetti explosion, mascot celebration, updates task status to `completed`, records completion timestamp.
5. **Abandon / Give Up**: Non-punitive check-in, prompts user to log what blocked them or break it down.
