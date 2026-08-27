import React, { useState, useRef, useEffect } from 'react';
import { AgentState, Task, EnergyLevel, FocusSession, ChatMessage, MicroStep } from '../../types';
import { MascotAvatar } from './MascotAvatar';
import { generateAgentReply } from '../../core/agentAIEngine';
import { audioEngine } from '../../core/audioEngine';
import { X, Send, Sparkles, Play, Check, Volume2, Flame, Bot } from 'lucide-react';

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agent.chatHistory, isGenerating]);

  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;
    onSetTalking(true);
    audioEngine.speakText(
      text,
      agent.persona,
      () => onSetTalking(true),
      () => onSetTalking(false)
    );
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    if (soundEnabled) audioEngine.playSfx('pop');

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
      if (soundEnabled) audioEngine.playSfx('ding');
      speakMessage(response.replyText);
    } catch {
      // Fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySteps = (suggestedSteps: string[]) => {
    if (!task) return;
    if (soundEnabled) audioEngine.playSfx('boing');
    const microSteps: MicroStep[] = suggestedSteps.map((s, idx) => ({
      id: `ms-${Date.now()}-${idx}`,
      text: s.replace(/^\d+\.\s*/, ''),
      completed: false,
      estimatedMinutes: 2
    }));
    onApplySteps(task.id, microSteps);
  };

  const quickPrompts = [
    { label: "😫 Can't get started", prompt: "I'm experiencing severe task paralysis and can't get started. Help!" },
    { label: "🌶️ Roast me", prompt: "Roast me for procrastinating on this task!" },
    { label: "🧩 3 Micro-Steps", prompt: "Break this task into 3 ridiculously easy 2-minute baby steps." },
    { label: "☕ Give me a pep talk", prompt: "Give me an energetic ADHD-friendly pep talk." },
    { label: "📱 Keep getting distracted", prompt: "I keep checking my phone and getting distracted." }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', height: '85vh', display: 'flex', flexDirection: 'column', padding: '1rem', background: '#fbf9f4' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #121826', paddingBottom: '0.65rem', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MascotAvatar mood={agent.currentMood} isTalking={agent.isTalking} size={46} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>Budge AI Accountability</strong>
                <span className="nb-badge" style={{ background: agent.persona === 'spicy' ? '#fca5a5' : agent.persona === 'direct' ? '#fed7aa' : '#fbcfe8', fontSize: '0.68rem' }}>
                  {agent.persona.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {task ? `Target: "${task.title.substring(0, 32)}..."` : 'No active task selected'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioEngine.stopSpeaking();
              onClose();
            }}
            style={{
              background: '#ffffff',
              border: '2px solid #121826',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.3rem', marginBottom: '0.6rem' }}>
          {agent.chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: isUser ? '#121826' : '#ffffff',
                    color: isUser ? '#ffffff' : '#0f172a',
                    border: '2px solid #121826',
                    boxShadow: isUser ? '2px 2px 0px rgba(0,0,0,0.3)' : '2.5px 2.5px 0px #121826',
                    borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.86rem',
                    lineHeight: 1.35,
                    fontWeight: isUser ? 600 : 700
                  }}
                >
                  <p>{msg.text}</p>

                  {/* Suggested Micro Steps Actions */}
                  {msg.suggestedSteps && msg.suggestedSteps.length > 0 && (
                    <div style={{ marginTop: '0.6rem', background: '#fffbeb', border: '1.5px solid #121826', borderRadius: '8px', padding: '0.5rem', color: '#1e293b' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Sparkles size={12} color="#eab308" /> Proposed Micro-Steps:
                      </div>
                      <ol style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', marginBottom: '0.45rem' }}>
                        {msg.suggestedSteps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                      {task && (
                        <button
                          type="button"
                          className="nb-btn nb-btn-success"
                          style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
                          onClick={() => handleApplySteps(msg.suggestedSteps!)}
                        >
                          <Check size={13} strokeWidth={3} /> Inject Into Task & Focus!
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action button if present */}
                  {msg.actionType === 'start_focus' && task && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        className="nb-btn nb-btn-primary"
                        style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
                        onClick={() => {
                          onStartFocus(task.id);
                          onClose();
                        }}
                      >
                        <Play size={13} fill="#121826" /> Start 25m Focus Sesh Now
                      </button>
                    </div>
                  )}
                </div>

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => speakMessage(msg.text)}
                    style={{
                      marginTop: '2px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                    title="Read aloud"
                  >
                    <Volume2 size={11} /> Speak
                  </button>
                )}
              </div>
            );
          })}

          {isGenerating && (
            <div style={{ alignSelf: 'flex-start', background: '#ffffff', border: '2px solid #121826', borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bot size={14} className="animate-spin" /> Budge is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompt Chips */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              className="nb-btn"
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.5rem',
                whiteSpace: 'nowrap',
                background: '#ffffff',
                flexShrink: 0
              }}
              onClick={() => handleSendMessage(qp.prompt)}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          style={{ display: 'flex', gap: '0.4rem' }}
        >
          <input
            type="text"
            className="quick-capture-input"
            placeholder={`Talk to ${agent.name}... (e.g. 'I keep checking Twitter', 'Help me start')`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isGenerating}
            autoFocus
          />
          <button
            type="submit"
            className="nb-btn nb-btn-primary"
            disabled={isGenerating || !inputVal.trim()}
            style={{ padding: '0.5rem 0.8rem' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
