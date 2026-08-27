import { Task, AgentPersona, AgentMood, EnergyLevel, FocusSession } from '../types';

export interface AIResponse {
  replyText: string;
  mood: AgentMood;
  suggestedSteps?: string[];
  actionType?: 'start_focus' | 'snooze' | 'apply_steps' | 'take_break';
}

export interface AIContext {
  task: Task | null;
  persona: AgentPersona;
  userEnergy: EnergyLevel;
  timer: FocusSession;
  geminiApiKey?: string;
}

export async function generateAgentReply(userMessage: string, context: AIContext): Promise<AIResponse> {
  const { task, persona, userEnergy, timer, geminiApiKey } = context;
  const msgLower = userMessage.toLowerCase();
  const taskTitle = task ? task.title : 'your general inbox';

  // If user provided a Gemini API Key, attempt to call Gemini API
  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are "Budge", a humanized ADHD accountability mascot agent in a neo-brutalist macOS app.
Persona: ${persona.toUpperCase()} (gentle = validating & kind; direct = pragmatic & no-nonsense; spicy = sarcastic playfully roasting goblin).
Active Task: "${taskTitle}" (Snoozed ${task?.snoozeCount || 0} times, Estimated: ${task?.estimatedMinutes || 25}m).
User Energy: ${userEnergy}.
Timer: ${timer.status}.

User said: "${userMessage}"

Respond in 1-3 short punchy sentences as Budge.
Format your output as JSON:
{
  "replyText": "your response here",
  "mood": "idle" | "watching" | "hyped" | "judging" | "worried" | "celebrating",
  "suggestedSteps": ["step 1", "step 2", "step 3"] (optional, if user needs task breakdown)
}`
                }
              ]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              replyText: parsed.replyText || rawContent,
              mood: parsed.mood || 'idle',
              suggestedSteps: parsed.suggestedSteps
            };
          }
        }
      }
    } catch {
      // Fallback to local intelligent reasoning
    }
  }

  // High-signal Intelligent Local Reasoning Engine
  return generateLocalSmartReply(userMessage, msgLower, task, persona, userEnergy, timer);
}

function generateLocalSmartReply(
  _rawMsg: string,
  msgLower: string,
  task: Task | null,
  persona: AgentPersona,
  userEnergy: EnergyLevel,
  timer: FocusSession
): AIResponse {
  const taskTitle = task ? `"${task.title}"` : 'your task';

  // 1. Overwhelm / Freeze / Can't start
  if (msgLower.includes('overwhelm') || msgLower.includes("can't start") || msgLower.includes('stuck') || msgLower.includes('paralyz') || msgLower.includes('hard')) {
    const steps = [
      `Open the workspace/tab for ${taskTitle}`,
      `Write 1 sloppy sentence or create 1 blank line`,
      `Set a 2-minute timer and promise yourself you can stop right after`
    ];

    if (persona === 'gentle') {
      return {
        replyText: `Overwhelm is just your nervous system asking for smaller steps. Let's do something ridiculously small. I generated 3 baby steps below — just click 'Apply' and we will do step 1 together! 🌸`,
        mood: 'worried',
        suggestedSteps: steps,
        actionType: 'apply_steps'
      };
    } else if (persona === 'direct') {
      return {
        replyText: `Classic initiation friction. Forget the whole project. Here are 3 micro-actions under 2 minutes each. Pick step 1 now.`,
        mood: 'watching',
        suggestedSteps: steps,
        actionType: 'apply_steps'
      };
    } else {
      return {
        replyText: `Your brain is tricking you into thinking ${taskTitle} is a dragon. It's actually a kitten in a cardboard box! Here are 3 tiny bites. Eat one! 🌶️`,
        mood: 'hyped',
        suggestedSteps: steps,
        actionType: 'apply_steps'
      };
    }
  }

  // 2. Roast request
  if (msgLower.includes('roast') || msgLower.includes('insult') || msgLower.includes('yell at me') || msgLower.includes('call me out')) {
    if (persona === 'gentle') {
      return {
        replyText: `I don't have the heart to roast you! But seriously... ${taskTitle} has been waiting patiently. You'll feel 10x lighter once it's off your chest!`,
        mood: 'idle'
      };
    } else if (persona === 'direct') {
      return {
        replyText: `You've spent more time asking me to roast you than it takes to write the first paragraph of ${taskTitle}. Stop looking at me and click Start Focus.`,
        mood: 'judging',
        actionType: 'start_focus'
      };
    } else {
      const roasts = [
        `Look at you, paying rent in the Procrastination Hilton! ${taskTitle} isn't going to complete itself while you stare at my green ears!`,
        `Oh, you want a roast? Your browser has 57 tabs open and 56 of them are excuses. Get to work!`,
        `If procrastination was an Olympic sport, you'd miss the podium because you were looking for the 'perfect playlist'. Press Start Focus!`
      ];
      return {
        replyText: roasts[Math.floor(Math.random() * roasts.length)],
        mood: 'judging',
        actionType: 'start_focus'
      };
    }
  }

  // 3. Break down / Subtask generation request
  if (msgLower.includes('break') || msgLower.includes('steps') || msgLower.includes('chunk') || msgLower.includes('subtask')) {
    const steps = [
      `1. Open document/app for ${taskTitle}`,
      `2. Jot down 3 messy bullet points`,
      `3. Complete the single easiest bullet point first`
    ];

    return {
      replyText: `Here is an atomic breakdown to get momentum started on ${taskTitle}. Ready to inject these into your task?`,
      mood: 'hyped',
      suggestedSteps: steps,
      actionType: 'apply_steps'
    };
  }

  // 4. Distraction / Phone / Social Media confession
  if (msgLower.includes('distract') || msgLower.includes('phone') || msgLower.includes('twitter') || msgLower.includes('youtube') || msgLower.includes('reddit') || msgLower.includes('tiktok') || msgLower.includes('instagram')) {
    if (persona === 'gentle') {
      return {
        replyText: `The algorithm is designed to steal your attention. Put your phone across the room for just 15 minutes. Let's do a mini sprint on ${taskTitle}.`,
        mood: 'watching',
        actionType: 'start_focus'
      };
    } else if (persona === 'direct') {
      return {
        replyText: `Close the distraction tab right now. Turn phone face down. 25 minutes on the clock starts in 3... 2... 1.`,
        mood: 'watching',
        actionType: 'start_focus'
      };
    } else {
      return {
        replyText: `🚨 RED ALERT! Dopamine trap detected! Put the phone in another zip code and face ${taskTitle} like the glorious goblin you are!`,
        mood: 'hyped',
        actionType: 'start_focus'
      };
    }
  }

  // 5. Tired / Low Energy / Exhausted
  if (msgLower.includes('tired') || msgLower.includes('exhaust') || msgLower.includes('sleep') || msgLower.includes('low energy') || msgLower.includes('zombie')) {
    return {
      replyText: `Low energy detected (Zombie Mode). Let's switch your mode to 🪫 in the header so we only queue 5-minute low-resistance quick wins. No heavy lifting today.`,
      mood: 'worried'
    };
  }

  // 6. Motivation / Pep talk
  if (msgLower.includes('motivat') || msgLower.includes('pep') || msgLower.includes('inspire') || msgLower.includes('help me')) {
    if (persona === 'gentle') {
      return {
        replyText: `You don't need to feel motivated to start. Action comes before motivation. Just take one tiny breath and open the file. I'm right here with you! 🌸`,
        mood: 'celebrating'
      };
    } else if (persona === 'direct') {
      return {
        replyText: `Motivation is a fickle friend. Discipline and 25 minutes of single-tasking will get you across the finish line. Let's start the timer.`,
        mood: 'watching',
        actionType: 'start_focus'
      };
    } else {
      return {
        replyText: `You survived 100% of your worst days and 100% of your unfiled taxes! You can definitely crush ${taskTitle}! Let's roll! 🔥`,
        mood: 'hyped',
        actionType: 'start_focus'
      };
    }
  }

  // 7. General conversational reply
  if (persona === 'gentle') {
    return {
      replyText: `I hear you! When it comes to ${taskTitle}, what is the absolute smallest thing we could do right now to make 1% progress?`,
      mood: 'idle'
    };
  } else if (persona === 'direct') {
    return {
      replyText: `Understood. If you're ready, let's lock in on ${taskTitle} for the next sprint. What's step 1?`,
      mood: 'watching'
    };
  } else {
    return {
      replyText: `Interesting story! But will it finish ${taskTitle}? Probably not! Let's click Start Focus and get this bag! 💰`,
      mood: 'hyped'
    };
  }
}
