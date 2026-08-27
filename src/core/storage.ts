import { AppState } from './stateMachine';

const STORAGE_KEY = 'nudgebuddy_state_v1';
let saveTimeout: NodeJS.Timeout | null = null;

export function saveStateToStorage(state: AppState): void {
  // Debounce saves so rapid timer ticks (1/sec) do not block the main thread
  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  }, 1000);
}

export function saveStateImmediately(state: AppState): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function loadStateFromStorage(): AppState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as AppState;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return null;
  }
}

export function clearStateFromStorage(): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear state from localStorage:', err);
  }
}
