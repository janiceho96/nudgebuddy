import React, { useState, useRef, useEffect } from 'react';
import { AgentState, Task, EnergyLevel, FocusSession, ChatMessage, MicroStep } from '../../types';
import { MascotAvatar } from './MascotAvatar';
import { generateAgentReply } from '../../core/agentAIEngine';
import { audioEngine } from '../../core/audioEngine';
import { X, Send, Sparkles, Play, Check, Bot, Heart, Coffee } from 'lucide-react';

interface AgentChatModalProps {
  agent: AgentState;
  task: Task | null;
  userEnergy: EnergyLevel;
  timer: FocusSession;
  isOpen: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  geminiApiKey?: string;
  onClose: () => void;
  onAddMessage: (msg: ChatMessage) => void;
  onSetTalking: (talking: boolean) => void;
  onStartFocus: (taskId: string) => void;
  onApplySteps: (taskId: string, steps: MicroStep[]) => void;
}

export const AgentChatModal: React.FC<AgentChatModalProps> = ({
  agent,
  task,
  userEnergy,
  timer,
  isOpen,
  soundEnabled,
  voiceEnabled,
  geminiApiKey,
  onClose,
  onAddMessage,
  onSetTalking,
  onStartFocus,
  onApplySteps
}) => {
  if (!isOpen) return null;

  const [inputVal, setInputVal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const history = agent?.chatHistory && agent.chatHistory.length > 0
    ? agent.chatHistory
    : [
        {
          id: 'welcome-1',
          sender: 'agent' as const,
          text: `Hello friend! 🌿 I'm Sprout, your mindful forest companion. How is your energy feeling today? Let me know if you'd like to break down ${task ? `"${task.title}"` : 'your intention'} into tiny, peaceful steps.`,
          timestamp: new Date().toISOString(),
          mood: 'celebrating' as const
        }
      ];

  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      // safe ignore
    }
  }, [history.length, isGenerating]);

  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;
    try {
      onSetTalking(true);
      audioEngine.speakText(
        text,
        agent.persona,
        () => onSetTalking(true),
        () => onSetTalking(false)
      );
    } catch {
      onSetTalking(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    if (soundEnabled) {
      try { audioEngine.playSfx('pop'); } catch {}
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    onAddMessage(userMsg);
    setInputVal('');
    setIsGenerating(true);

    try {
      const response = await generateAgentReply(text.trim(), {
        task,
        persona: agent.persona,
        userEnergy,
        timer,
        geminiApiKey
      });

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response.replyText,
        mood: response.mood,
        suggestedSteps: response.suggestedSteps,
        actionType: response.actionType,
        timestamp: new Date().toISOString()
      };

      onAddMessage(agentMsg);
      if (soundEnabled) {
        try { audioEngine.playSfx('ding'); } catch {}
      }
      speakMessage(response.replyText);
    } catch (err) {
      console.warn('Agent reply error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySteps = (suggestedSteps: string[]) => {
    if (!task) return;
    if (soundEnabled) {
      try { audioEngine.playSfx('boing'); } catch {}
    }
    const microSteps: MicroStep[] = suggestedSteps.map((s, idx) => ({
      id: `ms-${Date.now()}-${idx}`,
      text: s.replace(/^\d+\.\s*/, ''),
      completed: false,
      estimatedMinutes: 2
    }));
    onApplySteps(task.id, microSteps);
  };

  const quickPrompts = [
    { label: "🌱 Help me start gently", prompt: "I'm feeling stuck or overwhelmed. Can you give me a calm, gentle way to start?" },
    { label: "🧩 3 Tiny Micro-Steps", prompt: "Please break my task into 3 ridiculously easy 2-minute micro steps." },
    { label: "🍵 Mindful Pep Talk", prompt: "Give me a warm, supportive pep talk to center my focus." },
    { label: "🧘 Reset Overthinking", prompt: "I'm caught in an overthinking loop. Help me ground myself in the present." }
  ];

  return (
    <div className="modal-overlay" style={{ zIndex: 999999 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '460px',
          width: '92%',
          height: '82vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.1rem',
          background: '#f2f7f4',
          border: '1.5px solid var(--border-dark)',
          borderRadius: '22px',
          boxShadow: '0 20px 48px -12px rgba(20, 54, 34, 0.22)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-dark)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MascotAvatar mood={agent.currentMood} isTalking={agent.isTalking} size={42} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#143622' }}>Sprout Forest Companion</strong>
                <span style={{ background: '#d8f3dc', color: '#1b4332', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '10px' }}>
                  🌿 SANCTUARY
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {task ? `Intention: "${task.title.substring(0, 28)}..."` : 'Mindful guidance'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              try { audioEngine.stopSpeaking(); } catch {}
              onClose();
            }}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-dark)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.3rem', marginBottom: '0.6rem' }}>
          {history.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: isUser ? '#2d6a4f' : '#ffffff',
                    color: isUser ? '#ffffff' : '#143622',
                    border: isUser ? 'none' : '1px solid var(--border-dark)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '0.7rem 0.9rem',
                    fontSize: '0.86rem',
                    lineHeight: 1.45,
                    fontWeight: isUser ? 500 : 500
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>

                  {/* Suggested Micro Steps Actions */}
                  {msg.suggestedSteps && msg.suggestedSteps.length > 0 && (
                    <div style={{ marginTop: '0.65rem', background: '#eaf5ee', border: '1px solid #b7e4c7', borderRadius: '12px', padding: '0.55rem 0.7rem', color: '#1b4332' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>🌱</span>
                        <span>Gentle Micro-Steps:</span>
                      </div>
                      <ol style={{ paddingLeft: '1.1rem', margin: '0 0 0.5rem 0', fontSize: '0.78rem', lineHeight: 1.4 }}>
                        {msg.suggestedSteps.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>
                        ))}
                      </ol>
                      {task && (
                        <button
                          type="button"
                          onClick={() => handleApplySteps(msg.suggestedSteps!)}
                          style={{
                            width: '100%',
                            padding: '0.35rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: '#2d6a4f',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Check size={12} /> Add steps to current task
                        </button>
                      )}
                    </div>
                  )}

                  {/* Quick Action Start Focus */}
                  {msg.actionType === 'start_focus' && task && (
                    <button
                      type="button"
                      onClick={() => {
                        onStartFocus(task.id);
                        onClose();
                      }}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: '#52b788',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Play size={12} /> Begin 25m Focus Sprint
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div style={{ alignSelf: 'flex-start', background: '#ffffff', border: '1px solid var(--border-dark)', borderRadius: '16px', padding: '0.6rem 0.9rem', fontSize: '0.8rem', color: '#40916c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} className="spinning-sparkle" />
              <span>Sprout is thinking mindfully...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.45rem', marginBottom: '0.45rem' }}>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.prompt)}
              disabled={isGenerating}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.3rem 0.6rem',
                background: '#ffffff',
                border: '1px solid var(--border-dark)',
                borderRadius: '12px',
                whiteSpace: 'nowrap',
                color: '#2d6a4f',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputVal);
              }
            }}
            placeholder="Talk with Sprout or ask for guidance..."
            disabled={isGenerating}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: '12px',
              border: '1px solid var(--border-dark)',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#ffffff',
              color: 'var(--text-main)'
            }}
          />
          <button
            type="button"
            onClick={() => handleSendMessage(inputVal)}
            disabled={isGenerating || !inputVal.trim()}
            style={{
              padding: '0 0.85rem',
              background: '#2d6a4f',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: inputVal.trim() ? 'pointer' : 'default',
              opacity: inputVal.trim() ? 1 : 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
