import { AgentPersona, AgentMood, AgentTriggerEvent, AgentDialogue, Task } from '../types';

export function getAgentDialogue(
  event: AgentTriggerEvent,
  persona: AgentPersona,
  task?: Task | null
): AgentDialogue {
  const taskTitle = task ? `"${task.title}"` : 'your intention';

  switch (event) {
    case 'ON_INIT': {
      if (persona === 'gentle') {
        return {
          quote: "Take a deep grounding breath. Like trees in the forest, we grow quietly one ring at a time.",
          mood: 'idle',
          subtitle: 'Lush Forest Sanctuary active 🌿'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Root your attention into the present. What is the single seed we are planting today?",
          mood: 'idle',
          subtitle: 'Ancient Oak standing by 🌲'
        };
      } else {
        return {
          quote: "Let distractions scatter like autumn leaves. Bring your wild creativity to life.",
          mood: 'hyped',
          subtitle: 'Wild Flora blooming 🌸'
        };
      }
    }

    case 'ON_TASK_SELECT': {
      if (persona === 'gentle') {
        return {
          quote: `A meaningful choice in ${taskTitle}. Flow at your own pace.`,
          mood: 'idle'
        };
      } else if (persona === 'direct') {
        return {
          quote: `Centered on ${taskTitle}. 25 minutes of quiet, deliberate progress.`,
          mood: 'watching'
        };
      } else {
        return {
          quote: `Focusing our energy on ${taskTitle}. Let's bring clarity to this idea.`,
          mood: 'hyped'
        };
      }
    }

    case 'ON_FOCUS_START': {
      if (persona === 'gentle') {
        return {
          quote: `Entering gentle flow for ${taskTitle}. Protect your peace and breathe.`,
          mood: 'watching'
        };
      } else if (persona === 'direct') {
        return {
          quote: `Deep focus sprint initiated. Release outside distractions for ${taskTitle}.`,
          mood: 'watching'
        };
      } else {
        return {
          quote: `Space created. Time to immerse yourself in ${taskTitle}.`,
          mood: 'watching'
        };
      }
    }

    case 'ON_FOCUS_PAUSE': {
      if (persona === 'gentle') {
        return {
          quote: "Pausing for a mindful breath. Re-ground your energy whenever you are ready.",
          mood: 'idle'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Session paused. Guard your focus against random context switching.",
          mood: 'watching'
        };
      } else {
        return {
          quote: "Notice what pulled your attention away. When ready, let's gently return.",
          mood: 'idle'
        };
      }
    }

    case 'ON_FOCUS_RESUME': {
      return {
        quote: "Welcome back to your flow state.",
        mood: 'watching'
      };
    }

    case 'ON_FOCUS_COMPLETE': {
      if (persona === 'gentle') {
        return {
          quote: `✨ Beautiful focus. 25 minutes of thoughtful presence invested in ${taskTitle}.`,
          mood: 'celebrating'
        };
      } else if (persona === 'direct') {
        return {
          quote: `🎯 Well done. Meaningful milestone reached on ${taskTitle}.`,
          mood: 'celebrating'
        };
      } else {
        return {
          quote: `🌿 A wonderful chapter completed. Notice how good it feels to finish with intention.`,
          mood: 'celebrating'
        };
      }
    }

    case 'ON_FOCUS_GIVE_UP': {
      return {
        quote: "Honoring your capacity today. Releasing this session with self-compassion.",
        mood: 'worried'
      };
    }

    case 'ON_SNOOZE': {
      const count = task?.snoozeCount || 1;
      return {
        quote: count >= 2
          ? "Feeling internal friction with this task? Let's break it down gently into tiny steps."
          : "Saved for when you feel ready. No pressure.",
        mood: count >= 2 ? 'worried' : 'idle'
      };
    }

    case 'ON_AVOIDANCE_DETECTED': {
      return {
        quote: "Heavy emotional resistance detected. You don't have to tackle the whole mountain — just 2 minutes.",
        mood: 'worried'
      };
    }

    case 'ON_TASK_ADD': {
      return {
        quote: `Unburdened ${taskTitle} from your mind into your calm queue.`,
        mood: 'idle'
      };
    }

    case 'ON_POKE':
    default:
      return getRandomBanter(persona, task?.snoozeCount || 0);
  }
}

export function getRandomBanter(persona: AgentPersona, _snoozeLevel: number = 0): AgentDialogue {
  if (persona === 'gentle') {
    const quotes = [
      { quote: "I'm watering your focus plant with warm sunshine today! 🌱✨", mood: 'celebrating' as AgentMood },
      { quote: "One tiny gentle step is all we need, friend 🌸", mood: 'idle' as AgentMood },
      { quote: "Breathe in the pine breeze... you're doing so well 🍃", mood: 'idle' as AgentMood },
      { quote: "Look at your progress sprouting! Proud of you 🌿💖", mood: 'celebrating' as AgentMood },
      { quote: "Hydration check! A warm sip of water or tea for your bright mind 🍵✨", mood: 'idle' as AgentMood }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  } else if (persona === 'direct') {
    const quotes = [
      { quote: "Ancient Oak standing tall with you 🌲. You've got this.", mood: 'watching' as AgentMood },
      { quote: "Protect your deep work sanctuary. One strong root at a time 🌿", mood: 'watching' as AgentMood },
      { quote: "25 minutes of unbroken attention is where magic happens ✨", mood: 'watching' as AgentMood }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  } else {
    const quotes = [
      { quote: "Wild Flora is blooming! Bring your sparkle to this task 🌸✨", mood: 'hyped' as AgentMood },
      { quote: "Release all worries — you are naturally brilliant! 🌱💖", mood: 'hyped' as AgentMood },
      { quote: "Sprout believes in you! Let's make something lovely 🍃⭐", mood: 'hyped' as AgentMood }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}
