# UI_PERSONALITY.md — Neo-Brutalist ADHD Design System

## 1. Visual Aesthetics & Philosophy

The UI merges **Neo-Brutalism** with **ADHD-Centric Cognitive Ergonomics**:

- **Bold, unapologetic contrast**: Thick `2.5px` - `3px` solid `#111827` borders eliminate visual ambiguity.
- **Hard 2D Drop Shadows**: `box-shadow: 4px 4px 0px #111827` creates a tactile, physical card feel without sluggish blur effects.
- **Vibrant, Dopamine-Friendly Palette**:
  - `Electric Yellow (#FFE600)` — "Do This Now" Hero Card & Attention CTA
  - `Lavender Pop (#D8B4FE)` — Agent speech bubble & Mascot accent
  - `Mint Green (#86EFAC)` — Success states, timer active progress & completion
  - `Coral Tangerine (#FB923C / #FDA4AF)` — Avoidance flags, urgency tags
  - `Off-White Canvas (#FFFDF8)` — Background base
  - `Pure Dark Ink (#111827)` — Text & border stroke
- **Micro-Interactions**: Bouncy button press effects (`transform: translate(2px, 2px); box-shadow: 1px 1px 0px #111827;`), playful hover states.

---

## 2. Layout Structure (macOS Sidebar Widget)

- **macOS Window Header**:
  - Traffic light action dots (Red = Close/Reset, Yellow = Mini mode, Green = Wide mode).
  - Energy selector badge (Zombie 🪫 / Vibe ⚡ / Beast 🚀).
  - Persona switcher dropdown.
- **Agent Zone**:
  - Animated mascot avatar with expressive mood states.
  - Interactive speech bubble with direct banter and poke reactions.
- **"Do This Now" Recommendation Card**:
  - The single most prominent UI element on screen.
  - Large start button, micro-step peek, and quick snooze button.
- **Compact Focus Timer**:
  - Giant countdown numerals in `JetBrains Mono`.
  - Pause / Resume / +5m panic buttons.
- **Scrollable Task Inbox**:
  - Clean card list with tags, urgency indicators, and snooze count badges.
  - Bottom sticky quick capture input.

---

## 3. ADHD Cognitive Load Guardrails

1. **Rule of One**: Never overwhelm the user with multiple simultaneous focus timers.
2. **Low Friction Capture**: Typing `Buy groceries 15m #errands !high` automatically categorizes and sets metadata.
3. **No Guilt Tripping**: Avoidance alerts are framed as curious problem-solving rather than shame/penalties.
