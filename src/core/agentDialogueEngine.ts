import { AgentPersona, AgentMood, AgentTriggerEvent, AgentDialogue, Task } from '../types';

export function getAgentDialogue(
  event: AgentTriggerEvent,
  persona: AgentPersona,
  task?: Task | null
): AgentDialogue {
  const taskTitle = task ? `"${task.title}"` : 'your task';

  switch (event) {
    case 'ON_INIT': {
      if (persona === 'gentle') {
        return {
          quote: "Hey there! Breathe. We don't have to conquer everything today. Just pick one tiny thing.",
          mood: 'idle',
          subtitle: 'Gentle Buddy is by your side 🌸'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Ready when you are. Pick the highest impact task and let's run a 25-minute sprint.",
          mood: 'idle',
          subtitle: 'Direct Coach standing by ⏱️'
        };
      } else {
        return {
          quote: "Oh good, you're here. Let's get something done before the doom-scrolling takes over again.",
          mood: 'hyped',
          subtitle: 'Spicy Goblin is watching you 🌶️'
        };
      }
    }

    case 'ON_TASK_SELECT': {
      if (persona === 'gentle') {
        return {
          quote: `Great choice on ${taskTitle}. No rush, let's take it one step at a time.`,
          mood: 'idle'
        };
      } else if (persona === 'direct') {
        return {
          quote: `Locked on ${taskTitle}. 25 minutes of single-task focus. Let's do it.`,
          mood: 'watching'
        };
      } else {
        return {
          quote: `Oh, you picked ${taskTitle}? Bold move! Let's see if we actually start this one.`,
          mood: 'hyped'
        };
      }
    }

    case 'ON_FOCUS_START': {
      if (persona === 'gentle') {
        return {
          quote: `Timer is running for ${taskTitle}! Put on some chill music. You got this.`,
          mood: 'watching'
        };
      } else if (persona === 'direct') {
        return {
          quote: `Clock is ticking. Close the other 37 browser tabs. Eyes on ${taskTitle}.`,
          mood: 'watching'
        };
      } else {
        return {
          quote: `Locking the doors! No Twitter, no fridge opening, only ${taskTitle}!`,
          mood: 'watching'
        };
      }
    }

    case 'ON_FOCUS_PAUSE': {
      if (persona === 'gentle') {
        return {
          quote: "Taking a quick breath? That's fine, but keep your head in the zone.",
          mood: 'idle'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Paused. Remember: context switching costs 15 minutes of focus. Resume soon.",
          mood: 'judging'
        };
      } else {
        return {
          quote: "Hey! Why did we pause?! Don't you dare go check your phone notifications!",
          mood: 'judging'
        };
      }
    }

    case 'ON_FOCUS_RESUME': {
      if (persona === 'gentle') {
        return {
          quote: "Welcome back! Let's glide through the rest of this session.",
          mood: 'watching'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Resuming. Let's power through to the finish line.",
          mood: 'watching'
        };
      } else {
        return {
          quote: "Good human. Now keep typing!",
          mood: 'watching'
        };
      }
    }

    case 'ON_FOCUS_COMPLETE': {
      if (persona === 'gentle') {
        return {
          quote: `🎉 You did it! 25 minutes on ${taskTitle}. I'm so proud of your focus!`,
          mood: 'celebrating'
        };
      } else if (persona === 'direct') {
        return {
          quote: `🎯 Solid work. That's 25 focused minutes banked. Check it off or take a 5m breather.`,
          mood: 'celebrating'
        };
      } else {
        return {
          quote: `🔥 HOLY SMOKES YOU ACTUALLY DID IT! Dopamine hit received! High five!`,
          mood: 'celebrating'
        };
      }
    }

    case 'ON_FOCUS_GIVE_UP': {
      if (persona === 'gentle') {
        return {
          quote: "It happens! Stopping early is okay. We can break it into a tiny 2-minute step next time.",
          mood: 'worried'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Session aborted. No problem. Let's figure out what blocked you.",
          mood: 'idle'
        };
      } else {
        return {
          quote: "Oof! Slain by distraction! Let's regroup and chop this monster down into micro-steps.",
          mood: 'worried'
        };
      }
    }

    case 'ON_SNOOZE': {
      const count = task?.snoozeCount || 1;
      if (persona === 'gentle') {
        return {
          quote: count >= 2
            ? "Snoozing again? Totally okay. Maybe this task is feeling too big right now?"
            : "No problem, we'll put it on the back burner for a few minutes.",
          mood: count >= 2 ? 'worried' : 'idle'
        };
      } else if (persona === 'direct') {
        return {
          quote: count >= 2
            ? `Snoozed ${count} times. If you don't want to do it, break it down or delete it.`
            : "Snoozed. We will revisit it in a bit.",
          mood: count >= 2 ? 'judging' : 'idle'
        };
      } else {
        return {
          quote: count >= 2
            ? `Another snooze?! Are you planning to do ${taskTitle} in this lifetime or the next?`
            : "Snooze button pressed! I see you dodging responsibility!",
          mood: count >= 2 ? 'judging' : 'hyped'
        };
      }
    }

    case 'ON_AVOIDANCE_DETECTED': {
      if (persona === 'gentle') {
        return {
          quote: "Hey friend, looks like this task has high resistance. Let's do a 2-minute micro step together!",
          mood: 'worried'
        };
      } else if (persona === 'direct') {
        return {
          quote: "Avoidance alert! You've avoided this multiple times. Let's commit to 2 minutes only.",
          mood: 'worried'
        };
      } else {
        return {
          quote: "🚨 BEEP BEEP! Avoidance detected! You cannot hide from Budge! Let's slice this into baby bites!",
          mood: 'hyped'
        };
      }
    }

    case 'ON_TASK_ADD': {
      if (persona === 'gentle') {
        return {
          quote: `Added ${taskTitle} safely to your inbox. One thing off your mind!`,
          mood: 'idle'
        };
      } else if (persona === 'direct') {
        return {
          quote: `Task captured: ${taskTitle}. Queued up.`,
          mood: 'idle'
        };
      } else {
        return {
          quote: `Ooh, shiny new task: ${taskTitle}! Please say we'll actually finish this one.`,
          mood: 'hyped'
        };
      }
    }

    case 'ON_POKE':
    default:
      return getRandomBanter(persona, task?.snoozeCount || 0);
  }
}

export function getRandomBanter(persona: AgentPersona, _snoozeLevel: number = 0): AgentDialogue {
  if (persona === 'gentle') {
    const quotes = [
      { quote: "I'm right here cheering you on! Even 1% progress counts.", mood: 'idle' as AgentMood },
      { quote: "Hydration check! Grab a sip of water before our next sprint.", mood: 'idle' as AgentMood },
      { quote: "Be gentle with your brain today. You are doing great.", mood: 'idle' as AgentMood }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  } else if (persona === 'direct') {
    const quotes = [
      { quote: "Stop poking me and start the timer! Action breeds motivation.", mood: 'watching' as AgentMood },
      { quote: "One task at a time. Multi-tasking is just multi-distracting.", mood: 'watching' as AgentMood },
      { quote: "25 minutes of deep focus beats 4 hours of half-hearted tabs.", mood: 'watching' as AgentMood }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  } else {
    const quotes = [
      { quote: "Hey! Don't poke me, poke the 'Start Focus' button!", mood: 'judging' as AgentMood },
      { quote: "Procrastination is just fear wearing a clown costume. Let's go!", mood: 'hyped' as AgentMood },
      { quote: "If you finish this task, I'll allow you to stare at a wall for 5 minutes.", mood: 'hyped' as AgentMood },
      { quote: "I see your browser has 42 tabs open. Which one are you running away from?", mood: 'judging' as AgentMood }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}
