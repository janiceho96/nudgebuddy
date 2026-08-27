import React from 'react';
import { AgentState } from '../../types';
import { MessageSquare, Volume2, Sparkles, Flame } from 'lucide-react';
import { audioEngine } from '../../core/audioEngine';

interface AgentSpeechBubbleProps {
  agent: AgentState;
  voiceEnabled: boolean;
  onPoke: () => void;
  onOpenChat: () => void;
  onSetTalking: (talking: boolean) => void;
}

export const AgentSpeechBubble: React.FC<AgentSpeechBubbleProps> = ({
  agent,
  voiceEnabled,
  onPoke,
  onOpenChat,
  onSetTalking
}) => {
  const getPersonaBadge = () => {
    switch (agent.persona) {
      case 'gentle':
        return <span className="nb-badge" style={{ background: '#fbcfe8' }}>🌸 Gentle</span>;
      case 'direct':
        return <span className="nb-badge" style={{ background: '#fed7aa' }}>⏱️ Direct</span>;
      case 'spicy':
        return <span className="nb-badge" style={{ background: '#fca5a5' }}>🌶️ Spicy</span>;
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetTalking(true);
    audioEngine.speakText(
      agent.currentQuote,
      agent.persona,
      () => onSetTalking(true),
      () => onSetTalking(false)
    );
  };

  return (
    <div className="speech-bubble" onClick={onOpenChat} title="Click to chat with Budge!">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e293b' }}>
            {agent.name}
          </span>
          <button
            type="button"
            onClick={handleSpeak}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
            title="Read quote aloud"
          >
            <Volume2 size={13} />
          </button>
        </div>
        {getPersonaBadge()}
      </div>

      <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
        "{agent.currentQuote}"
      </p>

      {/* Interactive Chat CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '0.35rem' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Sparkles size={11} color="#eab308" /> Tap to talk or poke
        </span>

        <button
          type="button"
          className="nb-btn nb-btn-primary"
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenChat();
          }}
        >
          <MessageSquare size={12} /> Chat with Budge
        </button>
      </div>
    </div>
  );
};
