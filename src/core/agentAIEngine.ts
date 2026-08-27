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
  const { task, persona, geminiApiKey } = context;
  const msgLower = userMessage.toLowerCase();
  const taskTitle = task ? task.title : 'your intention';

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
                  text: `You are "Sol", a serene, empathetic, and wise focus sanctuary guide tailored for an INFJ personality in a minimalist macOS focus app.
Tone: Calm, grounding, thoughtful, uncluttered, deeply encouraging without toxic positivity or guilt.
Active Intention: "${taskTitle}" (Estimated: ${task?.estimatedMinutes || 25}m).

User said: "${userMessage}"

Respond in 1-2 short, soothing, and lucid sentences as Sol.
Format your output as JSON:
{
  "replyText": "your response here",
  "mood": "idle" | "watching" | "hyped" | "worried" | "celebrating",
  "suggestedSteps": ["step 1", "step 2"] (optional, if user asked for gentle step breakdown)
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
  return generateLocalSmartReply(userMessage, msgLower, task, persona);
}

function generateLocalSmartReply(
  _rawMsg: string,
  msgLower: string,
  task: Task | null,
  _persona: AgentPersona
): AIResponse {
  const taskTitle = task ? `"${task.title}"` : 'your intention';

  // 1. Overwhelm / Freeze / Can't start
  if (msgLower.includes('overwhelm') || msgLower.includes("can't start") || msgLower.includes('stuck') || msgLower.includes('paralyz') || msgLower.includes('hard')) {
    const steps = [
      `Open the workspace for ${taskTitle}`,
      `Write one rough sentence or jot down a simple thought`,
      `Sit with it for 2 gentle minutes without expectations`
    ];

    return {
      replyText: `Overwhelm is simply your mind asking for space. Let's make this light and gentle. Here are 3 quiet micro-steps. 🕊️`,
      mood: 'worried',
      suggestedSteps: steps,
      actionType: 'apply_steps'
    };
  }

  // 2. Break down / Subtask generation request
  if (msgLower.includes('break') || msgLower.includes('steps') || msgLower.includes('chunk') || msgLower.includes('subtask')) {
    const steps = [
      `1. Clarify the core outcome of ${taskTitle}`,
      `2. Draft the simplest first component`,
      `3. Allow yourself to refine as you flow`
    ];

    return {
      replyText: `Here is a gentle, structured path to start flowing into ${taskTitle}.`,
      mood: 'idle',
      suggestedSteps: steps,
      actionType: 'apply_steps'
    };
  }

  // 3. Distraction confession
  if (msgLower.includes('distract') || msgLower.includes('phone') || msgLower.includes('twitter') || msgLower.includes('youtube') || msgLower.includes('reddit')) {
    return {
      replyText: `Notice what drew your attention away without judgment. When you are ready, gently return your presence to ${taskTitle}.`,
      mood: 'watching',
      actionType: 'start_focus'
    };
  }

  // 4. Tired / Low Energy / Exhausted
  if (msgLower.includes('tired') || msgLower.includes('exhaust') || msgLower.includes('sleep') || msgLower.includes('low energy')) {
    return {
      replyText: `Honoring your low energy today. Do not force heavy lifting — just a quiet, 10-minute gentle touch on your intention.`,
      mood: 'worried'
    };
  }

  // 5. Motivation / Pep talk
  if (msgLower.includes('motivat') || msgLower.includes('pep') || msgLower.includes('inspire') || msgLower.includes('help me')) {
    return {
      replyText: `You don't need a surge of motivation to begin. Clarity arrives when you simply take the first peaceful step. 🕊️`,
      mood: 'celebrating'
    };
  }

  // 6. General conversational reply
  return {
    replyText: `I am here with you. What is the single most meaningful aspect of ${taskTitle} to explore right now?`,
    mood: 'idle'
  };
}
